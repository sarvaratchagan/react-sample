import * as React from 'react';
import { actions as postActions, Post, User } from 'app/service/posts';
import { Link, RouteProps } from 'react-router-dom';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import routes from '../../config/routes';

interface ViewComponentProps {
    readUsers: () => void;
    readPost: (id: number) => void;
    post: Post;
    error?: any;
    loading?: boolean;
    loadingText?: string;
    users: User[];
}

class ViewComponent extends React.Component<ViewComponentProps> {
    constructor(props: ViewComponentProps) {
        super(props);
    }

    componentDidMount() {
        const { match } = matchRoutes(routes, location.pathname)[0];
        const { params } = match;
        this.props.readUsers();
        if (params) {
            this.props.readPost((params as any).id);
        }
    }

    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    render() {
        const { post, loading, users } = this.props;
        return (
            <div className="w-100 h-100">
                <div className="row d-flex flex-row">
                    <div className="col-lg-12 col-md-12 col-sm-12 pt-4 pb-4">
                        <Link to="/posts" className="btn btn-primary w-100">
                            Go Back
                        </Link>
                    </div>
                </div>
                {post && (users || []).length > 0 && !loading && (
                    <div className="row d-flex flex-row">
                        <div className="w-100 pt-3 pb-3">
                            Post Id : {post.id}
                        </div>
                        <div className="w-100 pt-3 pb-3">
                            User Id :{users[this.random(0, users.length)].name}
                        </div>
                        <div className="w-100 pt-3 pb-3">
                            Title : {post.title}
                        </div>
                        <div className="w-100 pt-3 pb-3">{post.body}</div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    users: state.posts.users,
    post: state.posts.post,
    error: state.posts.error,
    loading: state.global.loading,
    loadingText: state.global.loadingText,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
    readPost: (id: number): void => {
        dispatch(postActions.post(id));
    },
    readUsers: (): void => {
        dispatch(postActions.users());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ViewComponent);
