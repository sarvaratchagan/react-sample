import * as React from 'react';
import { User, Post } from 'app/service/posts';
import { connect } from 'react-redux';
import Loading from './Loading';

interface PostComponentProps {
    key?: number;
    readUser?: (id: number) => void;
    readPost?: (id: number) => void;
    user?: User;
    post?: Post;
    error?: any;
    loading?: boolean;
    loadingText?: string;
}

class MyPost extends React.Component<PostComponentProps> {
    public constructor(props: any) {
        super(props);
    }

    public render() {
        const { user, post, loading, loadingText } = this.props;

        return (
            <div className="col-lg-4 col-md-6 col-sm-12 pt-3 pb-3 align-items-stretch">
                {loading && <Loading loadingText={loadingText} />}
                {user && post && (
                    <div className="card h-100">
                        <div className="card-header">
                            {post.id} : {post.title}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">
                                User Id : {user.name}
                            </h5>
                            <p className="card-text">{post.body}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(
    null,
    null,
)(MyPost);
