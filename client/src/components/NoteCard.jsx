const NoteCard = ({ title, content }) => {
  return (
    <div className="border p-4 rounded hover:shadow">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm mt-2">{content}</p>
    </div>
  );
};

export default NoteCard;
