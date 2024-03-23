/** @type {import("prettier").Config} */
const config = {
    tabWidth: 4,
    printWidth: 120,
    overrides: [
        {
            files: "*.yml",
            options: {
                tabWidth: 2,
            },
        },
    ],
};

export default config;
