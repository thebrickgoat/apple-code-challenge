<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
    <header>
        <div class="wrapper">
            <div>
                <img class="logo" src="@/assets/logo-2.svg" alt="me in a photo booth" />
            </div>
            <nav>
                <RouterLink to="/challenge-one">challenge one</RouterLink>
                <RouterLink to="/challenge-two">challenge two</RouterLink>
                <RouterLink to="/challenge-three">challenge three</RouterLink>
            </nav>
        </div>
    </header>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

img {
    display: block;
    margin: 0 auto 2rem;
    max-width: 50%;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}
</style>
