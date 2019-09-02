import * as React from 'react';
import { User, Post, actions as postActions } from 'app/service/posts';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';

interface PostComponentProps {
    key?: number;
    postId?: number;
    userId?: number;
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

    componentDidMount() {
        if (this.props.postId) {
            this.props.readUser(this.props.postId);
        }

        if (this.props.userId) {
            this.props.readPost(this.props.userId);
        }
    }

    public render() {
        const { user, post } = this.props;

        return (
            <div className="col-lg-4">
                {user && post && (
                    <div className="card">
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

const mapStateToProps = state => ({
    post: state.posts.post,
    user: state.posts.user,
    error: state.posts.error,
    loading: state.global.loading,
    loadingText: state.global.loadingText,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
    readPost: (id: number): void => {
        dispatch(postActions.post(id));
    },
    readUser: (id: number): void => {
        dispatch(postActions.user(id));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyPost);
