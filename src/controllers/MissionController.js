const controllers = {};

//import model and sequalize

var sequelize = require('../model/database');
var Mission = require('../model/Mission');

sequelize.sync();

controllers.list = async (req, res) => {
  var query_mission =
    'select m.id as missionId, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner, m.title, ' +
    '(CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) as days_left, ' +
    's.name, s.logo, n.icon, c.name, ' +
    "case when (CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) < 1 then 'Expired' " +
    "else 'Available' end as status, amount, currency " +
    'from missions m inner join starships s ' +
    'on m."starshipId"=s.id ' +
    'inner join networks n on n.id=s."networkId" inner join categories c on c.id=m."categoryId" ' +
    'group by ' +
    'm.id, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner, m.title,s.name, s.logo, n.icon, c.name order by m.expirationdate desc';

  const missions = await Mission.sequelize.query(query_mission, {
    type: Mission.sequelize.QueryTypes.SELECT,
  });

  res.json({
    success: true,
    data: missions,
  });
};

controllers.create = async (req, res) => {
  const {
    starship,
    start_date,
    expiration_date,
    categories,
    description,
    reward,
    winner,
    amount,
    currency,
    title,
  } = req.body;
  for (var key in categories) {
    await Mission.create({
      starshipId: starship,
      startdate: start_date,
      expirationdate: expiration_date,
      categoryId: categories[key],
      description: description,
      reward: reward,
      winner: winner,
      amount: amount,
      currency: currency,
      title: title,
    }).catch((error) => {
      console.log(error);
      return error;
    });
  }

  res.status(200).json({
    success: true,
    message: 'Data saved successfully!',
  });
};

controllers.getStarshipById = async (req, res) => {
  const { id } = req.params;

  var query_mission_by_starship =
    'select m.id as missionId, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner, m.title,' +
    '(CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) as days_left, ' +
    's.name, s.logo, n.icon, c.name as nameCategory, ' +
    "case when (CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) < 1 then 'Expired' " +
    "else 'Available' end as status, amount, currency " +
    'from missions m inner join starships s ' +
    'on m."starshipId"=s.id ' +
    'inner join networks n on n.id=s."networkId" inner join categories c on c.id =m."categoryId"  where m."starshipId" = :id ' +
    'group by ' +
    'm.id, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner, m.title, s.name, s.logo, n.icon, c.name order by m.expirationdate desc';

  const missions_by_starship = await Mission.sequelize.query(
    query_mission_by_starship,
    {
      replacements: { id: id },
      type: Mission.sequelize.QueryTypes.SELECT,
    }
  );

  res.json({
    success: true,
    data: missions_by_starship,
  });
};

controllers.getStarshipByIdCounter = async (req, res) => {
  const { id } = req.params;

  var query_mission_counter_status =
    'select status, count(status) as counter from ( ' +
    'select m.id as missionId, m."starshipId",  m.startdate, m.expirationdate, ' +
    'm.description, m.reward, m.winner, m.title, ' +
    '(CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) as days_left,  ' +
    's.name, s.logo, n.icon,  ' +
    "case when (CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) < 1 then 'Expired'  " +
    "else 'Available' end as status, amount, currency " +
    'from missions m inner join starships s ' +
    'on m."starshipId"=s.id ' +
    'inner join networks n on n.id=s."networkId" ' +
    'group by  ' +
    'm.id, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner, m.title,s.name, s.logo, n.icon order by m.expirationdate desc) as b ' +
    'where b."starshipId" = :id ' +
    'group by b.status';

  const missions_by_starship_counter = await Mission.sequelize.query(
    query_mission_counter_status,
    {
      replacements: { id: id },
      type: Mission.sequelize.QueryTypes.SELECT,
    }
  );

  res.json({
    success: true,
    data: missions_by_starship_counter,
  });
};

controllers.deleteByStarshipId = async (req, res) => {
  // parameter post
  const { id } = req.body;
  // delete sequelize
  const del = await Mission.destroy({
    where: { starshipId: id },
  });
  res.json({ success: true, deleted: del, message: 'Deleted successfully!' });
};

controllers.delete = async (req, res) => {
  // parameter post
  const { id } = req.body;
  // delete sequelize
  const del = await Mission.destroy({
    where: { id: id },
  });
  res.json({ success: true, deleted: del, message: 'Deleted successfully!' });
};

controllers.getByCategoryId = async (req, res) => {
  const { categories } = req.body;

  var query_mission_by_category =
    'select  m.id as missionId, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner,m.title, ' +
    '(CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) as days_left, ' +
    's.name, s.logo, n.icon, ' +
    "case when (CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) < 1 then 'Expired' " +
    "else 'Available' end as status, amount, currency " +
    'from missions m inner join starships s ' +
    'on m."starshipId"=s.id ' +
    'inner join networks n on n.id=s."networkId" where "categoryId" in (:id) ' +
    'group by ' +
    'm.id, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner,m.title, s.name, s.logo, n.icon';

  missions_by_category = await Mission.sequelize.query(
    query_mission_by_category,
    {
      replacements: { id: categories },
      type: Mission.sequelize.QueryTypes.SELECT,
    }
  );

  res.json({
    success: true,
    data: missions_by_category,
  });
};

controllers.update = async (req, res) => {
  const { id } = req.params;

  const {
    starship,
    start_date,
    expiration_date,
    categories,
    description,
    reward,
    winner,
    amount,
    currency,
    title,
  } = req.body;

  await Mission.update(
    {
      starshipId: starship,
      startdate: start_date,
      expirationdate: expiration_date,
      categoryId: categories[0],
      description: description,
      reward: reward,
      winner: winner,
      amount: amount,
      currency: currency,
      title: title,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  res.status(200).json({
    success: true,
    message: 'Data successfully update',
  });
};

controllers.getById = async (req, res) => {
  const { id } = req.params;

  var query_mission =
    'select m.id as missionId, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner,m.title, ' +
    '(CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) as days_left, ' +
    's.name, s.logo, n.icon, n.name as nameNetwork, n.alias, n.description as descriptionNetwork, ' +
    "case when (CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) < 1 then 'Expired' " +
    "else 'Available' end as status, amount, currency, c.id as categoryId, c.name as categoryName, s.website, s.twitter, s.discord, s.cointmarkecap " +
    'from missions m inner join starships s ' +
    'on m."starshipId"=s.id ' +
    'inner join networks n on n.id=s."networkId" inner join categories c on c.id = m."categoryId" where m.id = :id  ' +
    ' group by ' +
    'm.id, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner, s.name,m.title, s.logo, n.icon, c.id, c.name, s.website, s.twitter, s.discord, s.cointmarkecap, n.name, n.alias, n.description';

  const missionsById = await Mission.sequelize.query(query_mission, {
    replacements: { id: id },
    type: Mission.sequelize.QueryTypes.SELECT,
  });

  console.log(missionsById);

  let result = new Object();
  result.missionId = missionsById[0].missionid;
  result.starshipId = missionsById[0].starshipId;
  result.startdate = missionsById[0].startdate;
  result.expirationdate = missionsById[0].expirationdate;
  result.description = missionsById[0].description;
  result.reward = missionsById[0].reward;
  result.winner = missionsById[0].winner;
  result.days_left = missionsById[0].days_left;
  result.name = missionsById[0].name;
  result.logo = missionsById[0].logo;
  result.icon = missionsById[0].icon;
  result.status = missionsById[0].status;
  result.amount = missionsById[0].amount;
  result.currency = missionsById[0].currency;
  result.categoryId = missionsById[0].categoryid;
  result.categoryName = missionsById[0].categoryname;
  result.website = missionsById[0].website;
  result.twitter = missionsById[0].twitter;
  result.discord = missionsById[0].discord;
  result.cointmarkecap = missionsById[0].cointmarkecap;
  result.title = missionsById[0].title;
  result.nameNetwork= missionsById[0].namenetwork;
  result.alias = missionsById[0].alias;
  result.descriptionNetwork = missionsById[0].descriptionnetwork;

  res.json({
    success: true,
    data: result,
  });
};

controllers.searchByName = async (req, res) => {
  const { name } = req.body;

  var query_mission_search_by_name =
    'select m.id as missionId, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner,m.title, ' +
    '(CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) as days_left, ' +
    's.name, s.logo, n.icon, ' +
    "case when (CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) < 1 then 'Expired' " +
    "else 'Available' end as status, amount, currency " +
    'from missions m inner join starships s ' +
    'on m."starshipId"=s.id ' +
    'inner join networks n on n.id=s."networkId" where s.name ilike :name or m.title ilike :name ' +
    'group by ' +
    'm.id, m."starshipId",  m.startdate, m.expirationdate,  ' +
    'm.description, m.reward, m.winner,m.title, s.name, s.logo, n.icon order by m.expirationdate desc';

  const missions = await Mission.sequelize.query(query_mission_search_by_name, {
    replacements: { name: '%' + name + '%' },
    type: Mission.sequelize.QueryTypes.SELECT,
  });

  res.json({
    success: true,
    data: missions,
  });
};

module.exports = controllers;
