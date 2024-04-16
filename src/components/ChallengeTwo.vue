<script setup>
import { ref } from 'vue'

// For this challange, we need to have a user choose between three packages and then have a chance to win the other packages at random on successfly choosing a package . This should only occur once per hour per user.

//step one - write a form that allows users to select from three packages.
//step two - on submit and completion of sale, check the user to see if they have won in the past hour and if the product the selected is eligible for the promo ( also assume that the user is authed somehow and that we can check the user object for this data )
//step three - if they have not won in the past hour, randomly decide if they are a winner or not based on a supplied chance. Assume that buying multiple packages does not increase the chance of winning.
//step four - if they are a winner, display a message to the user that they have won and give them the option to claim the other two packages. If they choose to claim the prize, mark them as a winner with a timestamp of the current order indicating the order as a win and complete the order with the added prize packages. If they choose not to claim the prize, mark the order and do not add the prize packages to the order.
//step five- save the order to the user, and reset the ui to allow for more orders to be placed.

//define a user, in a real app this would be coming from the server and would be authed somehow but for this we will just use a ref to store the data
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'john@doe.biz',
  lastWinTime: null,
  orders: []
})

// define the packages that the user can choose from, also would be coming from a server in a real app
const packages = ref([
  {
    id: 1,
    name: 'Prints',
    description: 'A 4x6 Photo Print',
    price: 500,
    promo: true, //this would be more complicated in a real app, ie there would be a array of codes or something, but for this we are just saying this is a bool and that is only one posssible promo
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'Panoramas',
    description: '6x12 Panoramic Print',
    price: 700,
    promo: true,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'Strips',
    description: 'Two 2x6 Photo Strips',
    price: 500,
    promo: true,
    image: 'https://via.placeholder.com/150'
  }
])

// other variables to store the selected packages, loading state, error state, and the chance of winning, bools for if the modal is open and if the user has won etc etc
const selectedPackages = ref([])
const isLoading = ref(false)
const displayError = ref(null)
const chanceOfWinning = 0.5 // 50% chance of winning for now
const isModalOpen = ref(false)
const hasWon = ref(false)
const showDebug = ref(false)

// a function to format cents to dollars
const formatCentsToDollars = (cents) => {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

// a function to check the packages and see if the user has won upon clicking the buy button
const checkPackages = async () => {
  isModalOpen.value = true
  isLoading.value = true
  // check through the available packages and see if at least one of them is a promo package
  let isEligible = selectedPackages.value.some(
    (packageId) => packages.value.find((p) => p.id === packageId).promo
  )

  // check if the user has won in the past hour
  if (user.value.lastWinTime && new Date() - new Date(user.value.lastWinTime) < 3600000) {
    isEligible = false
  }

  // if the user is eligible, roll to see if they win and if so set the hasWon value to true and show the modal
  if (isEligible && Math.random() < chanceOfWinning) {
    await new Promise((r) => setTimeout(r, 1000)) // simulate a delay
    hasWon.value = true
    isLoading.value = false
  } else {
    finishOrder()
  }
}

const claimPrize = () => {
  user.value.lastWinTime = new Date() // make a new date to insert if they claim the prize
  // add the other two packages to the selected packages
  selectedPackages.value = [
    ...new Set([
      ...selectedPackages.value,
      ...packages.value
        .filter((p) => p.promo && !selectedPackages.value.includes(p.id))
        .map((p) => p.id)
    ])
  ]
  finishOrder(true)
}

const finishOrder = (isPromo) => {
  //simulate a server delay and then add the order to the user object, which would be upated on the server in a real app on sucessful order
  isLoading.value = true
  setTimeout(() => {
    const total = !isPromo
      ? selectedPackages.value.reduce(
          (sum, id) => sum + packages.value.find((p) => p.id === id).price,
          0
        )
      : packages.value.find((x) => x.id == selectedPackages.value[0]) // if its a promo package, just use the price of the first package selected
    user.value.orders.push({
      id: user.value.orders.length + 1, // we are just incrementing here but it would be better to use a uuid or something unique in a real app
      date: new Date().toISOString().split('T')[0],
      packages: selectedPackages.value.map((id) => packages.value.find((p) => p.id === id)),
      total: total,
      promo: isPromo ? 'Promo' : 'None' // this would be more complex if there were more promo types, here we can just say promo or none
    })

    //reset our frontend ui values
    selectedPackages.value = []
    isLoading.value = false
    hasWon.value = false
  }, 1000)
}
</script>

<template>
  <section>
    <h1>Challenge Two</h1>
    <div class="c3">
      <form @submit.prevent="checkPackages">
        <div class="c3__packages">
          <div class="c3__package" v-for="p in packages" :key="p.id">
            <img :src="p.image" alt="image" />
            <div class="c3__package-info">
              <div class="c3__package-name">{{ p.name }}</div>
              <div class="c3__package-description">{{ p.description }}</div>
              <div class="c3__package-price">{{ formatCentsToDollars(p.price) }}</div>

              <label class="container">
                <input
                  type="checkbox"
                  :value="p.id"
                  v-model="selectedPackages"
                  :checked="isChecked"
                />
                <span class="checkmark">{{
                  selectedPackages.includes(p.id) ? 'Added!' : 'Add'
                }}</span>
              </label>
            </div>
          </div>
        </div>
        <button type="submit" :disabled="selectedPackages.length === 0">
          Buy Package<template v-if="selectedPackages.length > 1">s</template>
        </button>
      </form>
      <div v-if="isModalOpen" class="c3__modal">
        <div class="c3__modal-content">
          <template v-if="isLoading">
            <div class="loader"></div>
          </template>
          <template v-else>
            <div v-if="hasWon">
              <h2>Congratulations! You are a winner!</h2>
              <p>
                You are eligible to receive a copy of each package you did not select totally for
                free! Simply click the "Claim Prize" button to continue!
              </p>
              <div class="c3__modal-button-wrapper">
                <button @click="claimPrize">Claim Prize</button>
                <button @click="() => finishOrder(false)">No Thanks</button>
              </div>
            </div>
            <div v-else>
              <p v-if="displayError">{{ displayError }}</p>
              <p v-else>Thank You! Your Order is Being Processed.</p>
              <div class="c3__modal-button-wrapper">
                <button @click="isModalOpen = false">Continue Shopping</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- Displaying user object for debug -->
    <pre v-if="showDebug">Debuggy User Object:{{ user }}</pre>
  </section>
</template>

<style scoped>
.c3 {
  margin: 1rem auto;
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 8px 0px;
}

.c3__packages {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 1rem 0;
}

.c3__package {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.c3__package-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.c3__package-name {
  font-weight: bold;
}

.c3__package-price {
  font-weight: bold;
}

.container {
  display: block;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin-top: 1rem;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.container input ~ .checkmark {
  width: 100%;
  color: var(--button-background);
  padding: 0.5rem 1rem;
  border: 1px solid var(--button-background);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: 0.2s;
}

.container input:checked ~ .checkmark {
  background-color: var(--button-background);
  color: white;
}

.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.c3__modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.c3__modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 8px 0px;
  max-width: 90vw;
  margin: 0 auto;
}

.c3__modal-button-wrapper {
  margin-top: 1rem;
  gap: 0.5rem;
  display: flex;
}

pre {
  background-color: rgba(36, 46, 32, 0.527);
  border: white 1px solid;
  border-radius: 1rem;
  padding: 1rem;
  color: white;
  position: fixed;
  bottom: 5%;
  width: 90%;
  left: 5%;
}
</style>
