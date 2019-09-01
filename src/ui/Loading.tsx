import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner';

interface LoadingProps {
    classes?: any;
    loadingText?: string;
}

class Loading extends React.Component<LoadingProps, {}> {
    constructor(props: LoadingProps) {
        super(props);
    }

    public render() {
        const { classes, loadingText } = this.props;
        return (
            <div className={classes.container}>
                <Spinner animation="border" variant="danger" />
                {loadingText && (
                    <span className={classes.labelClass}> {loadingText} </span>
                )}
            </div>
        );
    }
}

export default Loading;
