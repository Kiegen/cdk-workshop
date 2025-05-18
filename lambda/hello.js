exports.handler = async (event) => {
    console.log("Event: ", JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain",},
        body: `Good Morning. CDK! you've hit ${event.path}\n`,
    }
}