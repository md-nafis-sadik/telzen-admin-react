export const validateZodSchema = ({ schema, data, onError = errorNotify }) => {
    const parseResult = schema.safeParse(data);

    if (!parseResult.success) {
        // Format the error messages for nested fields
        const formattedErrors = {};
        parseResult.error.errors.forEach((err) => {
            const path = err.path.join('.');
            formattedErrors[path] = err.message;
        });

        if (typeof onError === 'function') {
            onError({
                ...parseResult.error,
                formattedErrors
            });
        }

        return null;
    }

    return parseResult.data;
};