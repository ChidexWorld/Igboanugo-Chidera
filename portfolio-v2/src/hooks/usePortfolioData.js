import { useQuery } from '@tanstack/react-query';
import {
  getExperiences,
  getEducation,
  getSkills,
  getProjects,
  getSocialLinks,
  getProfilePictures
} from '../services/firestore';

// Individual hooks for each data type
export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: getExperiences,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useEducation = () => {
  return useQuery({
    queryKey: ['education'],
    queryFn: getEducation,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ['socialLinks'],
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProfilePictures = () => {
  return useQuery({
    queryKey: ['profilePictures'],
    queryFn: getProfilePictures,
    staleTime: 1000 * 60 * 5,
  });
};

// Combined hook for all portfolio data
export const usePortfolioData = () => {
  const experiences = useExperiences();
  const education = useEducation();
  const skills = useSkills();
  const projects = useProjects();
  const socialLinks = useSocialLinks();
  const profilePictures = useProfilePictures();

  const isLoading =
    experiences.isLoading ||
    education.isLoading ||
    skills.isLoading ||
    projects.isLoading ||
    socialLinks.isLoading ||
    profilePictures.isLoading;

  const isError =
    experiences.isError ||
    education.isError ||
    skills.isError ||
    projects.isError ||
    socialLinks.isError ||
    profilePictures.isError;

  const error =
    experiences.error ||
    education.error ||
    skills.error ||
    projects.error ||
    socialLinks.error ||
    profilePictures.error;

  return {
    data: {
      experiences: experiences.data || [],
      education: education.data || [],
      skills: skills.data || [],
      projects: projects.data || [],
      socialLinks: socialLinks.data || [],
      profilePictures: profilePictures.data || [],
    },
    isLoading,
    isError,
    error,
  };
};
