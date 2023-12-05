<template></template>
<script setup lang="ts">
const { api } = useFeathers()
const { data: categories } = toRefs(api.service('categories').findInStore(ref({ query: {} })))
</script>