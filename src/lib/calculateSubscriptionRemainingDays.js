export const getSubscriptionRemainingDays = async (email, shopPlatform, shopName) => {
    try {
        // Fetch data from API
        const response = await fetch(
            `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${email}`
        );

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Validate response
        if (data.code !== 200 || !data.result) {
            return {
                success: false,
                message: data.message || "Invalid API response",
                remainingDays: null
            };
        }

        // Get the platform data
        const platformData = data.result[shopPlatform.toLowerCase()];

        if (!platformData || !Array.isArray(platformData)) {
            return {
                success: false,
                message: `No data found for platform: ${shopPlatform}`,
                remainingDays: null
            };
        }

        // Find the specific shop transaction
        const transaction = platformData.find(
            item => item.shopName === shopName
        );

        if (!transaction) {
            return {
                success: false,
                message: `Shop "${shopName}" not found in ${shopPlatform}`,
                remainingDays: null
            };
        }

        // Get today's date and expiration date
        const today = new Date();
        const expirationDate = new Date(transaction.paymentExpireTime);

        // Calculate difference in milliseconds
        const diffInMs = expirationDate - today;

        // Convert to days
        const remainingDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        // Determine status
        const isExpired = remainingDays < 0;
        const isExpiringSoon = remainingDays > 0 && remainingDays <= 30;
        console.log({
            success: true,
            remainingDays: remainingDays,
            expirationDate: expirationDate.toISOString(),
            formattedExpirationDate: expirationDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            isExpired: isExpired,
            isExpiringSoon: isExpiringSoon,
            transaction: transaction,
            status: isExpired ? 'expired' : isExpiringSoon ? 'expiring-soon' : 'active'
        });

        return {
            success: true,
            remainingDays: remainingDays,
            expirationDate: expirationDate.toISOString(),
            formattedExpirationDate: expirationDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            isExpired: isExpired,
            isExpiringSoon: isExpiringSoon,
            transaction: transaction,
            status: isExpired ? 'expired' : isExpiringSoon ? 'expiring-soon' : 'active'
        };

    } catch (error) {
        return {
            success: false,
            message: `Error: ${error.message}`,
            remainingDays: null
        };
    }
};