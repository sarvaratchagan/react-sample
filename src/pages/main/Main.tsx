import * as React from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Post } from 'app/service/posts';
import { Action, Dispatch } from 'redux';
import { actions as postActions } from 'app/service/posts';
import MyPost from '../../ui/MyPost';

interface MainComponentProps {
    read: () => void;
    posts: Post[];
    error?: any;
    loading?: boolean;
    loadingText?: string;
}

class Main extends React.Component<MainComponentProps> {
    public constructor(props: MainComponentProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.read();
    }

    public render() {
        const { posts, loading, loadingText } = this.props || {};
        return (
            <div className="w-100 h-100">
                <div className="row d-flex flex-row">
                    <div className="col-lg-4 col-md-12 col-sm-12 pt-4 pb-4">
                        <Button className="btn btn-danger w-100">Logout</Button>
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
                    {(posts || []).length}
                    {(posts || []).length > 0 &&
                        posts.map((post, i) => {
                            return (
                                <MyPost
                                    key={post.id}
                                    postId={post.id}
                                    userId={post.userId}
                                />
                            );
                        })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
    error: state.posts.error,
    loading: state.global.loading,
    loadingText: state.global.loadingText,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
    read: (): void => {
        dispatch(postActions.posts());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main);
