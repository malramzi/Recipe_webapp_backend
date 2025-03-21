const responseFormatter = (req, res, next) => {

    const oldJson = res.json;

    res.json = function (data) {
        const formattedResponse = {
            success: res.statusCode < 400,
            statusCode: res.statusCode,
            data: data,
            message: res.locals.message || "Success",
        };

        oldJson.call(this, formattedResponse);
    };

    next();
};

module.exports = responseFormatter;