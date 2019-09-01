import * as React from 'react';
import { renderRoutes } from 'react-router-config';

import history from './redux/history';
import routes from './config/routes';
import Notifier, { NotifierProps } from './ui/Notifier';
import { connect } from 'react-redux';

interface AppComponentProps {
    loading?: boolean;
    loadingText?: string;
    notifierOptions?: NotifierProps;
}

class App extends React.Component<AppComponentProps> {
    constructor(props: AppComponentProps) {
        super(props);
        history.listen((location, action) => {});
    }

    render() {
        let { message, variant, placement, dismissible, open, title } =
            this.props.notifierOptions || {};
        return (
            <div className="h-100 w-100">
                {open && (
                    <Notifier
                        title={title}
                        variant={variant}
                        message={message}
                        placement={placement}
                        dismissible={dismissible}
                        open={open}
                    />
                )}
                {renderRoutes(routes)}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.global.loading,
        loadingText: state.global.loadingText,
        notifierOptions: state.global.notifierOptions,
    };
};

export default connect(
    mapStateToProps,
    null,
)(App);
