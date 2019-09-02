import * as React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingProps {
    loadingText?: string;
}

class Loading extends React.Component<LoadingProps, {}> {
    constructor(props: LoadingProps) {
        super(props);
    }

    public render() {
        const { loadingText } = this.props;
        return (
            <div className="d-flex align-items-center justify-content-center">
                <Spinner animation="border" variant="danger" />
                {loadingText && <span> {loadingText} </span>}
            </div>
        );
    }
}

export default Loading;
