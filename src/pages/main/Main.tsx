import * as React from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Post, User } from 'app/service/posts';
import { Action, Dispatch } from 'redux';
import { actions as authActions } from 'app/service/auth';
import { actions as postActions } from 'app/service/posts';
import MyPost from '../../ui/MyPost';

interface MainComponentProps {
    readPosts: () => void;
    readUsers: () => void;
    logout: () => void;
    users: User[];
    posts: Post[];
    error?: any;
    loading?: boolean;
    loadingText?: string;
}

class Main extends React.Component<MainComponentProps> {
    public constructor(props: MainComponentProps) {
        super(props);
        this.logoutHandler = this.logoutHandler.bind(this);
    }

    public componentDidMount() {
        this.props.readPosts();
        this.props.readUsers();
    }

    private logoutHandler(event) {
        this.props.logout();
    }

    public render() {
        const { posts, users, loading, loadingText } = this.props || {};
        return (
            <div className="w-100 h-100">
                <div className="row d-flex flex-row">
                    <div className="col-lg-4 col-md-12 col-sm-12 pt-4 pb-4">
                        <Button
                            className="btn btn-danger w-100"
                            onClick={this.logoutHandler}
                        >
                            Logout
                        </Button>
                    </div>
                    <div className="col-lg-8 col-md-12 col-sm-12 pt-4 pb-4">
                        <InputGroup>
                            <FormControl
                                placeholder="search"
                                aria-label="searchTerm"
                                aria-describedby="search-term"
                            />
                        </InputGroup>
                    </div>
                </div>
                <div className="row d-flex flex-row">
                    {loading && <p>{loadingText}</p>}
                    {(posts || []).length > 0 &&
                        (users || []).length > 0 &&
                        posts.map((post, i) => {
                            return (
                                <MyPost
                                    key={i}
                                    post={post}
                                    user={
                                        users.filter(
                                            user => user.id === post.userId,
                                        )[0]
                                    }
                                />
                            );
                        })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    users: state.posts.users,
    posts: state.posts.posts,
    error: state.posts.error,
    loading: state.global.loading,
    loadingText: state.global.loadingText,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
    readPosts: (): void => {
        dispatch(postActions.posts());
    },
    readUsers: (): void => {
        dispatch(postActions.users());
    },
    logout: (): void => {
        dispatch(authActions.logout());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main);
