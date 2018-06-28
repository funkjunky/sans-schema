export default (modelName, otherModelName, manyToMany) => {
    const entry = Object.entries(manyToMany)
        .find(([m2mKey, modelKeys]) =>
            modelKeys.includes(modelName) && modelKeys.includes(otherModelName)
        );

    //return the key, which is the m2m key, ie. personsXhockeyTeams
    return entry ? entry[0] : undefined;
};
