const AuthorIntro = () => {
  return (
    <>
      <div className="bg-gray-800 py-8 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Hi, I'm Vaibhav Singh</h1>
            <p className="text-lg mb-4">A Full Stack Developer</p>
            <p className="text-lg mb-4">
              JavaScript is my magic wand that helps me do cool stuff!
            </p>
            <p className="text-lg">Let's build something awesome together!</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SkillBadge name="JavaScript" />
          <SkillBadge name="React" />
          <SkillBadge name="Node.js" />
          <SkillBadge name="Express.js" />
          <SkillBadge name="MongoDB" />
          <SkillBadge name="TypeScript" />
          <SkillBadge name="Docker" />
          <SkillBadge name="Aws-Sdk" />
        </div>
      </div>
    </>
  );
};

const SkillBadge = ({ name }) => {
  return (
    <div className="bg-gray-600 rounded-lg py-2 px-4 text-center">
      <p className="text-white font-semibold">{name}</p>
    </div>
  );
};

export default AuthorIntro;
