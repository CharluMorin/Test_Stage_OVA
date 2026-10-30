<script setup>
import { ref, computed, onMounted } from "vue";
import { useGroceryStore } from "../stores/groceryStore";

const store = useGroceryStore();

const name = ref("");
const quantity = ref(1);
const unitPrice = ref(null);
const editingId = ref(null);
const submitting = ref(false);
const errors = ref({});

const currency = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
});

const hasErrors = computed(() => Object.keys(errors.value).length > 0);

onMounted(() => {
  store.fetchItems();
});

function resetForm() {
  name.value = "";
  quantity.value = 1;
  unitPrice.value = null;
  editingId.value = null;
  errors.value = {};
}

function validate() {
  const result = {};

  if (!name.value || name.value.trim() === "") {
    result.name = "Le nom est requis";
  } else if (name.value.trim().length > 100) {
    result.name = "Le nom doit contenir 100 caractères ou moins";
  }

  if (!Number.isInteger(quantity.value) || quantity.value < 1) {
    result.quantity = "La quantité doit être un entier >= 1";
  }

  if (typeof unitPrice.value !== "number" || !(unitPrice.value >= 0.01)) {
    result.unitPrice = "Le prix doit être >= 0,01 $";
  } else if (Math.abs(unitPrice.value * 100 - Math.round(unitPrice.value * 100)) > 1e-9) {
    result.unitPrice = "Le prix doit avoir 2 décimales maximum";
  }

  errors.value = result;
  return !hasErrors.value;
}

async function submitForm() {
  if (submitting.value || !validate()) return;

  const item = {
    name: name.value.trim(),
    quantity: quantity.value,
    unit_price: unitPrice.value,
  };

  submitting.value = true;

  const success =
    editingId.value === null
      ? await store.addItem(item)
      : await store.updateItem(editingId.value, item);

  submitting.value = false;

  if (success) resetForm();
}

function startEdit(item) {
  editingId.value = item.id;
  name.value = item.name;
  quantity.value = item.quantity;
  unitPrice.value = item.unit_price;
  errors.value = {};
}

async function removeItem(item) {
  const success = await store.deleteItem(item.id);

  if (success && editingId.value === item.id) resetForm();
}

async function clearAll() {
  if (!confirm("Êtes-vous sûr de vouloir vider la liste?")) return;

  const success = await store.clearList();

  if (success) resetForm();
}

function formatPrice(price) {
  return currency.format(price);
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
        role="alert"
        style="white-space: pre-line"
      >
        {{ store.notification.message }}
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-3">
          <h2 class="h6 fw-bold text-dark mb-3">
            {{
              editingId === null ? "Ajouter un article" : "Modifier l'article"
            }}
          </h2>

          <form novalidate @submit.prevent="submitForm">
            <div class="row g-2 align-items-start">
              <div class="col-md-5">
                <label for="item-name" class="form-label small fw-semibold mb-1"
                  >Nom</label
                >
                <input
                  id="item-name"
                  v-model="name"
                  type="text"
                  maxlength="100"
                  class="form-control form-control-sm"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Nom du produit"
                />
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <div class="col-md-2">
                <label
                  for="item-quantity"
                  class="form-label small fw-semibold mb-1"
                  >Quantité</label
                >
                <input
                  id="item-quantity"
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  step="1"
                  class="form-control form-control-sm"
                  :class="{ 'is-invalid': errors.quantity }"
                />
                <div class="invalid-feedback">{{ errors.quantity }}</div>
              </div>

              <div class="col-md-3">
                <label
                  for="item-price"
                  class="form-label small fw-semibold mb-1"
                  >Prix unitaire ($)</label
                >
                <input
                  id="item-price"
                  v-model.number="unitPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  class="form-control form-control-sm"
                  :class="{ 'is-invalid': errors.unitPrice }"
                />
                <div class="invalid-feedback">{{ errors.unitPrice }}</div>
              </div>

              <div class="col-md-2 d-grid align-self-end">
                <button
                  type="submit"
                  class="btn btn-success btn-sm"
                  :disabled="submitting"
                >
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

      <div class="card border-0 shadow-sm">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
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
                  <td class="text-end">{{ formatPrice(item.unit_price) }}</td>
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
                  <th colspan="3" class="text-end text-dark">Total</th>
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