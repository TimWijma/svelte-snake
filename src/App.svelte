<script lang="ts">
    import { io } from "socket.io-client";
    import Snake from "./Snake.svelte";

    const socket = io("http://localhost:3000");
</script>

<Snake />