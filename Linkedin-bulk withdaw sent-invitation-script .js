/*
Skip Last 1 week sent request to withdraw
Developed by: Krutik Shah
Email: kshah16651@gmail.com
*/

(async function withdrawAllLinkedInRequests() {
  console.log("🚀 Starting TURBO LinkedIn auto-withdraw...");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  let withdrawnCount = 0;
  let stopFlag = false;

  // 🛑 Stop function
  window.stopWithdraw = function () {
    stopFlag = true;
    console.log("🛑 Stop command received. Finishing current action...");
  };

  async function clickLoadMoreIfExists() {
    const loadMoreBtn = Array.from(document.querySelectorAll("button, span"))
      .find((el) => /load more/i.test(el.innerText.trim()));
    if (loadMoreBtn) {
      console.log("🔄 Clicking 'Load more'...");
      loadMoreBtn.click();
      await delay(800); // faster than before
      return true;
    }
    return false;
  }

  async function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
    await delay(500); // shorter scroll wait
  }

  async function withdrawVisibleInvitations() {
    const withdrawSpans = Array.from(document.querySelectorAll("span"))
      .filter((span) => /withdraw/i.test(span.innerText.trim()));

    console.log(`🔎 Found ${withdrawSpans.length} withdraw button(s)`);

    for (let span of withdrawSpans) {
      if (stopFlag) return;

      try {
        const button = span.closest("button");
        if (!button) continue;

        button.click();
        await delay(120); // 🔥 very fast click

        const modalButton = Array.from(document.querySelectorAll("button span"))
          .find((s) => /withdraw/i.test(s.innerText.trim()));
        if (modalButton) {
          const confirmButton = modalButton.closest("button");
          if (confirmButton) {
            confirmButton.click();
            withdrawnCount++;
            console.log(`✅ Withdrawn #${withdrawnCount}`);
          }
        }

        // ⚡ ultra-short delay
        await delay(100 + Math.random() * 100);
      } catch (err) {
        console.error("⚠️ Error withdrawing:", err);
      }
    }
  }

  // Main loop
  while (!stopFlag) {
    await withdrawVisibleInvitations();

    if (stopFlag) break;

    const didLoadMore = await clickLoadMoreIfExists();
    if (!didLoadMore) {
      await scrollToBottom();
    }
  }

  console.log(`🏁 Script stopped. Total withdrawn: ${withdrawnCount}`);
})();
