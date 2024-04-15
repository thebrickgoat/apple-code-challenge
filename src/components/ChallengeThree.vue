<script setup>
defineProps({})
import { ref, computed } from 'vue'
// usally this would be done totally in the backend, with a UI just to see what the totals for machines are, but for this challenge we will do it in the frontend.
// we need to alllow for a user to enter in the monthly total of a machine and then we will calculate both the per month and the yearly tax total.

//step one - write a form that allows users to enter in totals for each month of the year, assumeing that the user will enter in a number for each month and there is no external source for the data.
//step two - multiply the monthly total by the tax rate to get the tax total for that month, and repeat for every month that has data entered.
//step three - add up all tax totals to get a yearly total based on entered values and display all totals, yearly and monthly, in the UI. Assume there is no need to hit a server to save these numbers.

// define a list of months to use in the form and some totals to store values
const months = ref([
  { name: 'January', total: 0 },
  { name: 'February', total: 0 },
  { name: 'March', total: 0 },
  { name: 'April', total: 0 },
  { name: 'May', total: 0 },
  { name: 'June', total: 0 },
  { name: 'July', total: 0 },
  { name: 'August', total: 0 },
  { name: 'September', total: 0 },
  { name: 'October', total: 0 },
  { name: 'November', total: 0 },
  { name: 'December', total: 0 }
])

//tax rate
const taxRate = ref(0.08625)

//calculate the yearly total, you could also write a function that calcs the monthly total returns it to display, but since its fairly simple we can just do it in the template
const yearlyTotal = computed(() => {
  //using a reduce to add up all the totals instead of a loop since its a bit cleaner
  const yearlyTotal = months.value.reduce((acc, month) => acc + month.total * taxRate.value, 0)
  return yearlyTotal.toFixed(2)
})

// a function to reset the totals
const resetTotals = () => {
  months.value.forEach((month) => (month.total = 0))
}
</script>

<template>
  <section>
    <h1>Challenge Three</h1>
    <div class="c3">
      <h2>Monthly Totals</h2>
      <p>Enter in the total for each month to calculate the tax total for that month.</p>
      <div>
        Current Tax Rate: <span style="font-weight: bold">{{ taxRate * 100 }}%</span>
      </div>
      <div class="c3__month" v-for="month in months" :key="month.name">
        <label>
          {{ month.name }} Total: $
          <input min="0.00" max="10000.00" step="0.01" type="number" v-model="month.total" />
        </label>
        <div>
          <span> Total Tax: ${{ (month.total * taxRate).toFixed(2) }}</span>
        </div>
      </div>

      <div class="c3__yearly">
        <button @click="resetTotals">Reset Totals</button>
        <span>Total Yearly Tax: ${{ yearlyTotal }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.c3 {
  margin: 1rem auto;
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 8px 0px;
}

.c3__month {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.c3__month span {
  font-weight: bold;
}

.c3__yearly {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: space-between;
}

.c3__yearly span {
  font-size: 2rem;
  font-weight: bold;
}
</style>
