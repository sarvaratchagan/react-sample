import * as React from 'react';
import { connect } from 'react-redux';

class NotFound extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="row">
                <div>
                    <h3>404 page not found</h3>
                    <p>
                        Looks like the page you were looking for is no longer.
                    </p>
                    <img
                        alt="seeking help?"
                        className="img-fluid"
                        src={require('../../../assets/images/help.svg')}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    null,
    null,
)(NotFound);
