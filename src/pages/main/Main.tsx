import * as React from 'react';
import {
    Button,
    FormControl,
    FormControlProps,
    InputGroup,
} from 'react-bootstrap';
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

interface MainComponentState {
    count: number;
    filtered: Post[];
}

class Main extends React.Component<MainComponentProps, MainComponentState> {
    $timeout: any;
    public constructor(props: MainComponentProps) {
        super(props);
        this.state = {
            count: 0,
            filtered: [],
        };
        this.$timeout = null;
        this.logoutHandler = this.logoutHandler.bind(this);
        this.updateUi = this.updateUi.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
    }

    public componentDidMount() {
        this.props.readPosts();
        this.props.readUsers();
        this.schedule();
    }

    componentWillUnmount() {
        clearTimeout(this.$timeout);
        this.$timeout = null;
        this.setState({ count: 0, filtered: [] });
    }

    private logoutHandler(event) {
        this.props.logout();
    }

    schedule() {
        this.$timeout = setTimeout(this.updateUi, 100);
    }

    updateUi() {
        // TODO replace this functionality with react-spring so that we can get very smooth results
        if ((this.props.posts || []).length > 0) {
            const count = this.state.count;
            const updatedState = {
                filtered: this.state.filtered.concat(
                    this.props.posts[this.state.count],
                ),
                count: count + 1,
            };
            this.setState(updatedState);
            if (updatedState.count < this.props.posts.length) {
                this.schedule();
            }
        }
    }

    searchHandler(event: React.FormEvent<FormControlProps>) {
        const control = event.target as any;
        const posts = this.props.posts;
        if (control.value.trim().length > 1) {
            const filtered = posts.filter(
                post =>
                    post.title.indexOf(control.value) > -1 ||
                    post.body.indexOf(control.value) > -1,
            );
            this.setState({ filtered, count: filtered.length });
        } else {
            this.setState({ filtered: posts, count: posts.length });
        }
    }

    public render() {
        const { users, loading, loadingText } = this.props || {};
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
                                onChange={this.searchHandler}
                                placeholder="search"
                                aria-label="searchTerm"
                                aria-describedby="search-term"
                            />
                        </InputGroup>
                    </div>
                </div>
                <div className="row d-flex flex-row">
                    {loading && <p>{loadingText}</p>}
                    {(this.state.filtered || []).length > 0 &&
                        (users || []).length > 0 &&
                        this.state.filtered.map((post, i) => {
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
