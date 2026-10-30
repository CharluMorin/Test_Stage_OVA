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
      } finally {
        this.loading = false;
      }
    },

    async run(action, successMessage) {
      try {
        await action();
        await this.fetchItems();
        this.notify("success", successMessage);
        return true;
      } catch (error) {
        this.notify("error", error.message);
        return false;
      }
    },

    addItem(item) {
      return this.run(() => groceryApi.create(item), "Item ajouté");
    },

    updateItem(id, item) {
      return this.run(() => groceryApi.update(id, item), "Item mis à jour");
    },

    deleteItem(id) {
      return this.run(() => groceryApi.remove(id), "Item supprimé");
    },

    clearList() {
      return this.run(() => groceryApi.removeAll(), "Liste vidée");
    },
  },
});
