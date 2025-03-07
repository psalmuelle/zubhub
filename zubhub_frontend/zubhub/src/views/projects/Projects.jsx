import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Grid, Box, ButtonGroup, Typography, Container } from '@material-ui/core';

import {
  fetchPage,
  fetchStaffPicks,
  updateProjects,
  updateStaffPicks,
} from './projectsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import StaffPick from '../../components/staff_pick/StaffPick';
import activity_of_the_month_svg from '../../assets/images/activity_of_the_month.svg';
import activity_of_the_month_small_svg from '../../assets/images/activity_of_the_month_small.svg';
import new_stuff from '../../assets/images/new_stuff.svg'
import styles from '../../assets/js/styles/views/projects/projectsStyles';
import commonStyles from '../../assets/js/styles';
import hikingIcon from '../../assets/images/hiking.svg';


const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function Projects View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Projects(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    loading: true,
  });

  React.useEffect(() => {
    fetchStaffPicks(props);
    handleSetState(fetchPage(null, props));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading } = state;
  const {
    results: projects,
    previous: prev_page,
    next: next_page,
  } = props.projects.all_projects;
  const { hero } = props.projects;
  const staff_picks = props.projects.staff_picks;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (projects && projects.length >= 0) {
    return (
      <>
        {projects.length > 0 ?
          (
            <Box className={classes.root}>
              {hero && hero.id ? (
                <Box className={classes.heroSectionStyle}>
                  <Box className={classes.heroContainerStyle}>
                    <Box className={classes.heroMessageContainerStyle}>
                      <Typography className={classes.heroMessageSecondaryStyle}>
                        {hero.description}
                      </Typography>
                      <Typography className={classes.heroMessagePrimaryStyle}>
                        {hero.title}
                      </Typography>
                      <CustomButton
                        className={classes.heroButtonStyle}
                        size="small"
                        primaryButtonStyle
                        onClick={() => props.history.push('/projects/create')}
                      >
                        {t('projects.shareProject')}
                      </CustomButton>
                      <a
                        className={common_classes.textDecorationNone}
                        href={
                          hero.explore_ideas_url
                            ? hero.explore_ideas_url
                            : 'https://kriti.unstructured.studio/'
                        }
                        target="__blank"
                        rel="noreferrer"
                      >
                        <CustomButton
                          className={classes.heroButtonStyle}
                          size="small"
                          darkDangerButtonStyle
                        >
                          {t('projects.exploreIdeas')}
                        </CustomButton>
                      </a>
                      <CustomButton
                        className={classes.heroButtonStyle}
                        size="small"
                        customWarningButtonStyle
                        onClick={() => props.history.push('/ambassadors')}
                      >
                        {t('projects.zubhubAmbassadors')}
                      </CustomButton>
                    </Box>
                    <Box
                      className={clsx(classes.heroImageContainerStyle, {
                        [common_classes.displayNone]: !hero.activity_url,
                      })}
                    >
                      <img
                        className={classes.heroImageTextSmallStyle}
                        src={new_stuff}
                        alt={t('projects.newStuff')}
                      />
                      <img
                        className={classes.heroImageTextStyle}
                        src={new_stuff}
                        alt={t('projects.newStuff')}
                      />
                      <a
                        className={classes.heroImageLinkStyle}
                        href={hero.activity_url}
                        target="__blank"
                        rel="noreferrer"
                      >
                        <img
                          className={classes.heroImageStyle}
                          src={hero.image_url}
                          alt=""
                        />
                      </a>
                    </Box>
                  </Box>
                </Box>
              ) : null}
          <Box className={classes.mainContainerStyle}>
            {staff_picks &&
              staff_picks.map(staff_pick => (
                <StaffPick
                  key={staff_pick.id}
                  staff_pick={staff_pick}
                  updateProjects={res =>
                    handleSetState(
                      updateStaffPicks(res, staff_pick.id, props, toast),
                    )
                  }
                  {...props}
                />
              ))}
            <Grid container>
              {staff_picks && staff_picks.length > 0 ? (
                <Grid item xs={12}>
                  <Typography
                    gutterBottom
                    component="h2"
                    variant="h6"
                    color="textPrimary"
                    className={classes.titleStyle}
                  >
                    {t('projects.allProjects')}
                  </Typography>
                </Grid>
              ) : null}
              {projects.map(project => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  align="center"
                  className={classes.projectGridStyle}
                >
                  <Project
                    project={project}
                    key={project.id}
                    updateProjects={res =>
                      handleSetState(updateProjects(res, props, toast))
                    }
                    {...props}
                  />
                </Grid>
              ))}
            </Grid>
            <div
              aria-label={t('projects.ariaLabels.prevNxtButtons')}
              className={classes.buttonGroupStyle}
            >
              {prev_page ? (
                <CustomButton
                className={clsx(classes.floatLeft, classes.buttonGroupStyleAlternative)}
                  size="large"
                  startIcon={<NavigateBeforeIcon />}
                  onClick={(e, page = prev_page.split('?')[1]) => {
                    handleSetState({ loading: true });
                    handleSetState(fetchPage(page, props));
                  }}
                  primaryButtonStyle
                >
                  {t('projects.prev')}
                </CustomButton>
              ) : null}
              {next_page ? (
                <CustomButton
                  className={clsx(classes.floatRight, classes.buttonGroupStyleAlternative)} 
                  size="large"
                  endIcon={<NavigateNextIcon />}
                  onClick={(e, page = next_page.split('?')[1]) => {
                    handleSetState({ loading: true });
                    handleSetState(fetchPage(page, props));
                  }}
                  primaryButtonStyle
                >
                  {t('projects.next')}
                </CustomButton>
              ) : null}
            </div>
          </Box>
            </Box>
          ) : (
            <Box className={classes.root}>
              <Container className={classes.welcomeContainerStyle}>
                <img
                  className={classes.welcomeStyle}
                  src={hikingIcon}
                  alt={'Create project'}
                />
                <Box className={classes.welcomeBoxStyle}>
                  <Typography variant="h1">{t('projects.welcome')}!</Typography>
                  <Typography variant="h5">{t('projects.errors.noProject')}</Typography>
                  <Box>
                    <CustomButton
                      className={classes.heroButtonStyle}
                      size="small"
                      primaryButtonStyle
                      onClick={() => props.history.push('/projects/create')}
                    >
                      {t('projects.createProject')}
                    </CustomButton>
                    <a
                      className={common_classes.textDecorationNone}
                      href={
                        hero.explore_ideas_url
                          ? hero.explore_ideas_url
                          : 'https://kriti.unstructured.studio/'
                      }
                      target="__blank"
                      rel="noreferrer"
                    >
                      <CustomButton
                        className={classes.heroButtonStyle}
                        size="small"
                        darkDangerButtonStyle
                      >
                        {t('projects.exploreIdeas')}
                      </CustomButton>
                    </a>
                  </Box>
                </Box>
              </Container>
            </Box>
          )}
    </>
    );
  } else {
    return <ErrorPage error={t('projects.errors.unexpected')} />;
  }
}

Projects.propTypes = {
  auth: PropTypes.object.isRequired,
  getProjects: PropTypes.func.isRequired,
  setProjects: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProjects: page => {
      return dispatch(ProjectActions.getProjects(page));
    },
    setProjects: args => {
      return dispatch(ProjectActions.setProjects(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
    getStaffPicks: args => {
      return dispatch(ProjectActions.getStaffPicks(args));
    },
    setStaffPicks: args => {
      return dispatch(ProjectActions.setStaffPicks(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
