<script setup>
import { ref, onMounted } from "vue";
import { useGroceryStore } from "../stores/groceryStore";

const store = useGroceryStore();

const name = ref("");
const quantity = ref(1);
const unitPrice = ref(null);

const editingId = ref(null);

onMounted(() => {
  store.fetchItems();
});

function resetForm() {
  name.value = "";
  quantity.value = 1;
  unitPrice.value = null;
  editingId.value = null;
}

async function submitForm() {
  const item = {
    name: name.value,
    quantity: quantity.value,
    unit_price: unitPrice.value,
  };

  let success;

  if (editingId.value === null) {
    success = await store.addItem(item);
  } else {
    success = await store.updateItem(editingId.value, item);
  }

  if (success) {
    resetForm();
  }
}

function startEdit(item) {
  editingId.value = item.id;
  name.value = item.name;
  quantity.value = item.quantity;
  unitPrice.value = item.unit_price;
}

function removeItem(item) {
  store.deleteItem(item.id);
}

function clearAll() {
  if (confirm("Remove every item from the list?")) {
    store.clearList();
  }
}

function formatPrice(price) {
  return price.toFixed(2) + " $";
}
</script>

<template>
  <div class="bg-light min-vh-100 py-4">
    <div class="container">
      <h1 class="h3 fw-bold text-dark mb-4">Ma liste d'épicerie</h1>

      <div
        v-if="store.notification"
        class="alert py-2 mb-3"
        :class="
          store.notification.type === 'success'
            ? 'alert-success'
            : 'alert-danger'
        "
        style="white-space: pre-line"
      >
        {{ store.notification.message }}
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-3">
          <h2 class="h6 fw-bold text-dark mb-3">
            {{ editingId === null ? "Ajouter un article" : "Modifier l'article" }}
          </h2>

          <form novalidate @submit.prevent="submitForm">
            <div class="row g-2 align-items-end">
              <div class="col-md-5">
                <label class="form-label small fw-semibold mb-1">Nom</label>
                <input
                  v-model="name"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Nom du produit"
                />
              </div>

              <div class="col-md-2">
                <label class="form-label small fw-semibold mb-1">Quantité</label>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  class="form-control form-control-sm"
                />
              </div>

              <div class="col-md-3">
                <label class="form-label small fw-semibold mb-1">
                  Prix unitaire ($)
                </label>
                <input
                  v-model.number="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control form-control-sm"
                />
              </div>

              <div class="col-md-2 d-grid">
                <button type="submit" class="btn btn-success btn-sm">
                  {{ editingId === null ? "Ajouter" : "Sauvegarder" }}
                </button>
              </div>
            </div>

            <button
              v-if="editingId !== null"
              type="button"
              class="btn btn-link btn-sm px-0 pb-0 mt-2 text-secondary"
              @click="resetForm"
            >
              Annuler
            </button>
          </form>
        </div>
      </div>

      <!-- Liste -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-3">
          <div
            class="d-flex justify-content-between align-items-center mb-3"
          >
            <div>
              <h2 class="h6 fw-bold text-dark mb-1">Liste des articles</h2>
              <p class="small text-secondary mb-0">
                {{ store.items.length }}
                {{ store.items.length === 1 ? "article" : "articles" }}
              </p>
            </div>

            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              :disabled="store.items.length === 0"
              @click="clearAll"
            >
              Vider la liste
            </button>
          </div>

          <div
            v-if="store.loading && store.items.length === 0"
            class="text-secondary small py-3"
          >
            Chargement...
          </div>

          <div
            v-else-if="store.items.length === 0"
            class="text-center text-secondary py-4"
          >
            <p class="small mb-0">La liste est vide.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-sm table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="fw-semibold text-dark">Nom</th>
                  <th class="text-center fw-semibold text-dark">Quantité</th>
                  <th class="text-end fw-semibold text-dark">Prix unitaire</th>
                  <th class="text-end fw-semibold text-dark">Sous-total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in store.items"
                  :key="item.id"
                  :class="{ 'table-warning': item.id === editingId }"
                >
                  <td>{{ item.name }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-end">
                    {{ formatPrice(item.unit_price) }}
                  </td>
                  <td class="text-end fw-semibold">
                    {{ formatPrice(item.quantity * item.unit_price) }}
                  </td>
                  <td>
                    <div class="d-flex justify-content-end gap-1">
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm"
                        @click="startEdit(item)"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-sm"
                        @click="removeItem(item)"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <th colspan="3" class="text-end text-dark">
                    Total
                  </th>
                  <th class="text-end text-success">
                    {{ formatPrice(store.totalPrice) }}
                  </th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
