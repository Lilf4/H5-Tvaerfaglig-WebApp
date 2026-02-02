<script lang="ts">
  import { registerPlugin } from '@capacitor/core';

  const CardData = registerPlugin<{
    set(options: { hex: string }): Promise<void>;
  }>('CardData');

  function setCard() {
    CardData.set({ hex: '414243' });
  }
</script>

<button on:click={setCard}>
  Set NFC Card Data
</button>
