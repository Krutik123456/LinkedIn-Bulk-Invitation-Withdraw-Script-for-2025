/*
Skip Last 1 week sent request to withdraw
Developed by: Krutik Shah
Email: kshah16651@gmail.com
*/

(async function withdrawOldLinkedInRequests() {
  console.log("🚀 Starting LinkedIn auto-withdraw (skipping <1 week old)...");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  let withdrawnCount = 0;
  let skippedCount = 0;
  let stopFlag = false;

  // 🛑 Stop function
  window.stopWithdraw = function () {
    stopFlag = true;
    console.log("🛑 Stop command received. Finishing current action...");
  };

  function isOlderThanOneWeek(el) {
    // Look for "Sent X time ago" text
    const text = el.innerText.toLowerCase();
    if (!text.includes("sent")) return true; // if no date, assume old
    
    // Extract number + unit (e.g., "3 days", "2 weeks")
    const match = text.match(/sent\s+(\d+)\s+(day|week|month|year)/);
    if (!match) return true; // fallback: assume old

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit.startsWith("day") && value < 7) return false; // too new
    if (unit.startsWith("hour")) return false; // very new
    return true; // week/month/year = old enough
  }

  async function clickLoadMoreIfExists() {
    const loadMoreBtn = Array.from(document.querySelectorAll("button, span"))
      .find((el) => /load more/i.test(el.innerText.trim()));
    if (loadMoreBtn) {
      console.log("🔄 Clicking 'Load more'...");
      loadMoreBtn.click();
      await delay(800);
      return true;
    }
    return false;
  }

  async function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
    await delay(500);
  }

  async function withdrawVisibleInvitations() {
    const withdrawSpans = Array.from(document.querySelectorAll("span"))
      .filter((span) => /withdraw/i.test(span.innerText.trim()));

    console.log(`🔎 Found ${withdrawSpans.length} withdraw button(s)`);

    for (let span of withdrawSpans) {
      if (stopFlag) return;

      try {
        // Check parent card for "Sent X time ago"
        const parentCard = span.closest("li, div");
        if (parentCard && !isOlderThanOneWeek(parentCard)) {
          skippedCount++;
          console.log("⏩ Skipped (too recent)");
          continue;
        }

        const button = span.closest("button");
        if (!button) continue;

        button.click();
        await delay(120);

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
    if (!didLoadMore) await scrollToBottom();
  }

  console.log(`🏁 Script stopped. Total withdrawn: ${withdrawnCount}, skipped (recent): ${skippedCount}`);
})();
