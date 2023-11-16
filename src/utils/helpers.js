// Helper Functions
export const DAY_MS = 24 * 60 * 60 * 1000; // H * MIN * SEC * MS


export const getDayAgo = () => {
    let dayAgo = Date.now() - DAY_MS + (5 * 60 * 1000); // 5 MIN
    dayAgo = new Date(dayAgo).toISOString();
    return dayAgo;
};

