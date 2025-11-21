import {
  type ApiResponse,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI
type UserProfileDto = components['schemas']['UserProfileDto'];
type UpdateProfileDto = components['schemas']['UpdateProfileDto'];
type ChangePasswordRequestDto =
  components['schemas']['ChangePasswordRequestDto'];

// Endpoints
const ENDPOINTS = {
  profile: '/api/v1/profile',
  userProfile: '/api/v1/mantine/user-profile',
  changePassword: '/api/v1/profile/change-password',
} as const;

// Hooks
export function useUserProfile(options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<UserProfileDto>(ENDPOINTS.userProfile, {
    enabled,
  });
}

// Mutations
export async function updateProfile(
  data: UpdateProfileDto,
): Promise<ApiResponse<any>> {
  return apiPut<any>(ENDPOINTS.profile, data);
}

export async function changePassword(
  data: ChangePasswordRequestDto,
): Promise<ApiResponse<any>> {
  return apiPost<any>(ENDPOINTS.changePassword, data);
}

// Combined hook with mutations for convenience
export function useUserProfileWithMutations() {
  const profileQuery = useUserProfile();

  const mutations = {
    update: async (data: UpdateProfileDto) => {
      const result = await updateProfile(data);
      profileQuery.refetch(); // Refresh the profile
      return result;
    },

    changePassword: async (data: ChangePasswordRequestDto) => {
      return await changePassword(data);
    },
  };

  return {
    ...profileQuery,
    mutations,
  };
}
