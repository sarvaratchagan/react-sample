import * as React from 'react';
import { Alert } from 'react-bootstrap';
import classNames = require('classnames');

export interface NotifierProps {
    title?: string;
    message: string;
    variant:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info'
        | 'dark'
        | 'light';
    placement?: string;
    dismissible?: boolean;
    open: boolean;
}

interface NotifierState {
    open: boolean;
}

class Notifier extends React.Component<NotifierProps, NotifierState> {
    constructor(props: NotifierProps) {
        super(props);
        this.state = {
            open: props.open || false,
        };
        this.handleClose = this.handleClose.bind(this);
    }

    private handleClose(): void {
        console.log('State Close');
        this.setState({
            open: false,
        });
    }

    render() {
        const { title, message, variant, placement, dismissible } = (this
            .props || {}) as NotifierProps;
        const open = this.state.open;
        return (
            <Alert
                className={classNames('hsbc-alert', placement)}
                show={open}
                variant={variant}
                dismissible={dismissible}
                onClose={this.handleClose}
            >
                {title && <Alert.Heading>{title}</Alert.Heading>}
                {message && <p>{message}</p>}
            </Alert>
        );
    }
}

export default Notifier;
