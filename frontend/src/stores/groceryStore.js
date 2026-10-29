import { defineStore } from "pinia";
import { groceryApi } from "../api/groceryApi";

let notificationTimer = null;

export const useGroceryStore = defineStore("grocery", {
  state: () => ({
    items: [],
    loading: false,
    notification: null,
  }),

  getters: {
    totalPrice() {
      let total = 0;

      for (const item of this.items) {
        total += item.quantity * item.unit_price;
      }

      return total;
    },
  },

  actions: {
    notify(type, message) {
      clearTimeout(notificationTimer);
      this.notification = { type, message };
      notificationTimer = setTimeout(() => (this.notification = null), 4000);
    },

    async fetchItems() {
      this.loading = true;

      try {
        this.items = await groceryApi.getAll();
      } catch (error) {
        this.notify("error", error.message);
      }

      this.loading = false;
    },

    async addItem(item) {
      try {
        await groceryApi.create(item);
        await this.fetchItems();
        this.notify("success", "Item ajouté");
        return true;
      } catch (error) {
        this.notify("error", error.message);
        return false;
      }
    },

    async updateItem(id, item) {
      try {
        await groceryApi.update(id, item);
        await this.fetchItems();
        this.notify("success", "Item mis à jour");
        return true;
      } catch (error) {
        this.notify("error", error.message);
        return false;
      }
    },

    async deleteItem(id) {
      try {
        await groceryApi.remove(id);
        await this.fetchItems();
        this.notify("success", "Item supprimé");
      } catch (error) {
        this.notify("error", error.message);
      }
    },

    async clearList() {
      try {
        await groceryApi.removeAll();
        await this.fetchItems();
        this.notify("success", "Liste vidée");
      } catch (error) {
        this.notify("error", error.message);
      }
    },
  },
});
