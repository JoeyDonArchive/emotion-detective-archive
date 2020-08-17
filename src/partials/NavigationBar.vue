<template>
  <div class="navbar">
    <nav class="container menu">
      <ul>
        <li>
          <router-link class="link" :to="{ name: 'dashboard' }"
            >Dashboard</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: transparent;
}

.menu {
  ul,
  li {
    padding: 0;
    margin: 0;
  }

  li {
    display: inline-grid;
    height: 5rem;
    align-items: center;
  }

  .link {
    font-weight: bold;
    color: #000;
    text-transform: uppercase;
  }
}
</style>
