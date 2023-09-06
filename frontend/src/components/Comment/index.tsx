import { ICommentPopulatedDocument } from "../../../../shared/interfaces";

interface ICommentProps {
  comment: ICommentPopulatedDocument;
}

const Comment = ({ comment }: ICommentProps) => {
  const { author } = comment;
  return (
    <li
      id={
        typeof comment._id === "string" ? comment._id : comment._id.toString()
      }
    >
      <p>{comment.message}</p>
      <p>{`${author?.firstName} ${author?.lastName}`}</p>
    </li>
  );
};

export default Comment;
