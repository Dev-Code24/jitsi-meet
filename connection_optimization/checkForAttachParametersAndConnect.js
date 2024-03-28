// --DEV-CODE EDITS DOWN
/**
 * Checks if we have data to use attach instead of connect. If we have the data
 * executes attach otherwise check if we have to wait for the data. If we have
 * to wait for the attach data we are setting handler to APP.connect.handler
 * which is going to be called when the attach data is received otherwise
 * executes connect.
 *
 * @param {string} [id] user id
 * @param {string} [password] password
 * @param {string} [roomName] the name of the conference.
 */
export default function checkForAttachParametersAndConnect(id, password, connection) {
    if (window.XMPPAttachInfo) {
        APP.connect.status = "connecting";

        // When connection optimization is not deployed or enabled the default
        // value will be window.XMPPAttachInfo.status = "error"
        // If the connection optimization is deployed and enabled and there is
        // a failure the value will be window.XMPPAttachInfo.status = "error"
        if (window.XMPPAttachInfo.status === "error") {
            connection.connect({
                id,
                password,
            });

            return;
        }

        const attachOptions = window.XMPPAttachInfo.data;

        if (attachOptions) {
            connection.attach(attachOptions);
            delete window.XMPPAttachInfo.data;
        } else {
            connection.connect({
                id,
                password,
            });
        }
    } else {
        APP.connect.status = "ready";
        APP.connect.handler = checkForAttachParametersAndConnect.bind(
            null,
            id,
            password,
            connection
        );
    }
}
// --DEV-CODE EDITS UP
