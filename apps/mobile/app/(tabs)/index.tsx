import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useMigrationHelper } from "@/core/db/client";
import { useInventoryStore } from "@/features/inventory/store";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const InventoryScreen = () => {
  //HOOKS

  const { success, error } = useMigrationHelper();
  const { items, refresh, addItem } = useInventoryStore();

  //STATES
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");

  useEffect(() => {
    if (success) refresh();
  }, [success]);

  const handleAddItem = async () => {
    if (!name || !sku) {
      Toast.error("Name and SKU are required");
      return;
    }

    await addItem(name, sku, 10);

    setName("");
    setSku("");
  };

  if (error) {
    return (
      <>
        <Text className="text-red-500 pt-10">
          Database ERROR:
          {error.message}
        </Text>
      </>
    );
  }
  if (!success) {
    return (
      <>
        <Text className="pt-10">Migrating DB...</Text>
      </>
    );
  }
  //RENDER

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-900 to-slate-800">
      <View className="flex-1 px-6">
        {/* Header Section */}
        <View className="py-6">
          <Text className="text-4xl font-bold text-white mb-2">Inventory</Text>
          <Text className="text-slate-400 text-sm">
            Manage your items and stock
          </Text>
        </View>

        {/* Add Item Card */}
        <View className="bg-slate-800/50 rounded-2xl p-5 mb-6 border border-slate-700/50 shadow-lg">
          <Text className="text-lg font-semibold text-white mb-4">
            Add New Item
          </Text>
          <View className="gap-3">
            <Input
              placeholder="Item Name"
              value={name}
              onChangeText={setName}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
            <Input
              placeholder="SKU"
              value={sku}
              onChangeText={setSku}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
            <Button
              onPress={handleAddItem}
              variant={"secondary"}
              className="mt-2"
            >
              <Text className="font-semibold">Add</Text>
            </Button>
          </View>
        </View>

        {/* Items List Section */}
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-white">
              Items ({items.length})
            </Text>
            <View className="flex-row gap-2">
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <Text className="text-xs text-slate-400">Synced</Text>
              <View className="w-2 h-2 bg-orange-500 rounded-full ml-3" />
              <Text className="text-xs text-slate-400">Pending</Text>
            </View>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refresh} />
            }
            renderItem={({ item }) => (
              <View className="bg-gradient-to-r from-slate-800 to-slate-700 p-5 mb-3 rounded-xl border border-slate-600/50 shadow-md">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg mb-1">
                      {item.name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <View className="bg-slate-600/50 px-2 py-1 rounded-md">
                        <Text className="text-slate-300 text-xs font-mono">
                          {item.sku}
                        </Text>
                      </View>
                      <View
                        className={`px-2 py-1 rounded-md ${
                          item.synced ? "bg-green-500/20" : "bg-orange-500/20"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            item.synced ? "text-green-400" : "text-orange-400"
                          }`}
                        >
                          {item.synced ? "✓ Synced" : "⟳ Pending"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="items-end ml-4">
                    <Text className="text-blue-400 font-bold text-2xl">
                      {item.quantity}
                    </Text>
                    <Text className="text-slate-400 text-xs">units</Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-slate-500 text-center text-lg">
                  No items yet
                </Text>
                <Text className="text-slate-600 text-center text-sm mt-2">
                  Add your first item above
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InventoryScreen;
