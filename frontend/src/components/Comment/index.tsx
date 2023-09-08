import { ICommentPopulatedDocument } from "../../../../shared/interfaces";
import { getInitials } from "../../../src/utils";

interface ICommentProps {
  comment: ICommentPopulatedDocument;
}

const Comment = ({ comment }: ICommentProps) => {
  const commentId =
    typeof comment._id === "string" ? comment._id : comment._id.toString();
  const { author } = comment;

  const handleUpdateComment = (commentId: string) => {
    console.log(`Update Comment ${commentId}`);
  };

  const handleDeleteComment = (commentId: string) => {
    console.log(`Delete Comment ${commentId}`);
  };

  return (
    <li id={commentId} className="comment comment__container">
      <div>
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={`Profile image of ${author?.firstName} ${author?.lastName}`}
            className="comment__avatar--image"
          />
        ) : (
          <span className="comment__avatar--initials">
            {getInitials(author.firstName, author.lastName)}
          </span>
        )}
      </div>
      <div>
        <header className="comment__header">
          <span>{`${author?.firstName} ${author?.lastName}`}</span>
          {comment?.createdAt && (
            <span>
              {typeof comment.createdAt === "string"
                ? new Date(comment.createdAt).toLocaleString()
                : comment.createdAt.toLocaleDateString()}
            </span>
          )}
        </header>
        <div className="comment__message">
          <p>{comment.message}</p>
        </div>
        <footer className="comment__footer comment__footer--actions">
          <button onClick={() => handleUpdateComment(commentId)}>Edit</button>
          <button onClick={() => handleDeleteComment(commentId)}>Delete</button>
        </footer>
      </div>
    </li>
  );
};

export default Comment;
