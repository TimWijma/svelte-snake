<script lang="ts">
    import { onMount } from "svelte";
    import { usernameStore } from "$lib/stores.js";

    onMount(() => {
        const storedUsername = localStorage?.getItem("username");
        if (storedUsername) {
            $usernameStore = storedUsername;
        }
    });
</script>

<slot></slot>
