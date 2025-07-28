const calculatePaymentExpireTime = (duration) => {
  const now = new Date();
  let expireDate = new Date(now);

  const durationMatch = duration.toLowerCase().match(/(\d+)\s*(month|months?)/);

  if (durationMatch) {
    const amount = parseInt(durationMatch[1]);
    const unit = durationMatch[2];

    if (unit.includes("month")) {
      expireDate.setMonth(now.getMonth() + amount);
    }
  } else {
    expireDate.setMonth(now.getMonth() + 1);
  }

  expireDate.setUTCHours(12, 0, 0, 0);

  return expireDate.toISOString();
};

export default calculatePaymentExpireTime;
