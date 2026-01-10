"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  XCircle,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
    }
  }
`;

const GET_MENU_ITEMS = gql`
  query GetMenuItems($restaurantId: String!) {
    menuItems(restaurantId: $restaurantId) {
      id
      restaurantId
      name
      description
      price
      imageUrl
      category
      isAvailable
      isVegetarian
      createdAt
    }
  }
`;

const CREATE_MENU_ITEM = gql`
  mutation CreateMenuItem($input: CreateMenuItemInput!) {
    createMenuItem(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_MENU_ITEM = gql`
  mutation UpdateMenuItem($id: String!, $input: UpdateMenuItemInput!) {
    updateMenuItem(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_MENU_ITEM = gql`
  mutation DeleteMenuItem($id: String!) {
    deleteMenuItem(id: $id)
  }
`;

interface Restaurant {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  createdAt: string;
}

interface RestaurantsData {
  restaurants: Restaurant[];
}

interface MenuItemsData {
  menuItems: MenuItem[];
}

interface MenuItemForm {
  restaurantId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
}

const defaultFormData: MenuItemForm = {
  restaurantId: "",
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
  isAvailable: true,
  isVegetarian: false,
};

export default function AdminMenuItemsPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<MenuItemForm>(defaultFormData);

  const { data: restaurantsData } = useQuery<RestaurantsData>(GET_RESTAURANTS);
  const { data: menuItemsData, loading, refetch } = useQuery<MenuItemsData>(GET_MENU_ITEMS, {
    variables: { restaurantId: selectedRestaurant },
    skip: !selectedRestaurant,
    fetchPolicy: "network-only",
  });

  const [createMenuItem, { loading: createLoading }] = useMutation(CREATE_MENU_ITEM, {
    onCompleted: () => {
      toast.success("Menu item created successfully");
      refetch();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateMenuItem, { loading: updateLoading }] = useMutation(UPDATE_MENU_ITEM, {
    onCompleted: () => {
      toast.success("Menu item updated successfully");
      refetch();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deleteMenuItem, { loading: deleteLoading }] = useMutation(DELETE_MENU_ITEM, {
    onCompleted: () => {
      toast.success("Menu item deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const restaurants = restaurantsData?.restaurants || [];
  const menuItems = menuItemsData?.menuItems || [];

  const filteredItems = menuItems.filter((item: any) => {
    if (!searchQuery) return true;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(defaultFormData);
  };

  const openCreateModal = () => {
    setFormData({ ...defaultFormData, restaurantId: selectedRestaurant });
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setFormData({
      restaurantId: item.restaurantId,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl,
      category: item.category,
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
    });
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateMenuItem({
        variables: {
          id: editingItem.id,
          input: {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            imageUrl: formData.imageUrl,
            category: formData.category,
            isAvailable: formData.isAvailable,
            isVegetarian: formData.isVegetarian,
          },
        },
      });
    } else {
      createMenuItem({
        variables: {
          input: {
            restaurantId: formData.restaurantId,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            imageUrl: formData.imageUrl,
            category: formData.category,
            isAvailable: formData.isAvailable,
            isVegetarian: formData.isVegetarian,
          },
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItem({ variables: { id } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Items Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage restaurant menu items
          </p>
        </div>
        {selectedRestaurant && (
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-2" />
            Add Menu Item
          </Button>
        )}
      </div>

      {/* Restaurant Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">
                Select Restaurant
              </label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
              >
                <option value="">Choose a restaurant...</option>
                {restaurants.map((restaurant: any) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedRestaurant && (
              <div className="flex-1 relative">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search menu items..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      {!selectedRestaurant ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Please select a restaurant to view its menu items
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No menu items found. Add your first menu item!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item: any) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.isVegetarian && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                      Veg
                    </span>
                  )}
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded",
                      item.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Category: {item.category}
                    </p>
                  </div>
                  <p className="font-bold text-lg text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(item)}
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteLoading}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <XCircle size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-sm min-h-20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Appetizers, Main Course"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={createLoading || updateLoading}>
                    {(createLoading || updateLoading) && (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    )}
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
