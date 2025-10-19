import axios from 'axios';

/**
 * VoteSmart API Integration Service
 * 
 * Fetches real candidate data from VoteSmart API including:
 * - Biographical information
 * - Education history
 * - Professional experience
 * - Political positions
 * - Committee memberships
 * - Ratings and endorsements
 */

const VOTESMART_API_BASE = 'https://api.paas.votesmart.io/api';
const VOTESMART_API_KEY = process.env.VOTESMART_API_KEY;

interface VoteSmartCandidate {
  candidateId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  preferredName?: string;
  birthDate?: string;
  birthPlace?: string;
  pronunciation?: string;
  gender?: string;
  family?: string;
  homeCity?: string;
  homeState?: string;
  education?: Education;
  profession?: string;
  political?: string;
  religion?: string;
  congMembership?: string;
  specialMsg?: string;
  photo?: string;
}

interface Education {
  institutions?: Array<{
    degree?: string;
    field?: string;
    school?: string;
    span?: string;
    gpa?: number;
    fullText?: string;
  }>;
}

interface Experience {
  experience?: Array<{
    title?: string;
    organization?: string;
    span?: string;
    special?: string;
    district?: string;
    fullText?: string;
  }>;
}

interface CandidateRating {
  sigId: string;
  ratingId: string;
  candidateId: string;
  rating: string;
  ratingName: string;
  timespan: string;
  ratingText?: string;
  categories?: Array<{
    categoryId: string;
    name: string;
  }>;
}

export class VoteSmartService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = VOTESMART_API_KEY || '';
    this.baseUrl = VOTESMART_API_BASE;
    
    if (!this.apiKey) {
      console.warn('⚠️ VoteSmart API key not configured. Some features may be limited.');
    }
  }

  /**
   * Check if VoteSmart API is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Find candidates by office and state
   */
  async findCandidatesByOfficeState(officeId: string, stateId: string, electionYear?: number): Promise<any[]> {
    try {
      const params: any = {
        key: this.apiKey,
        officeId,
        stateId,
      };
      
      if (electionYear) {
        params.electionYear = electionYear;
      }

      const response = await axios.get(`${this.baseUrl}/candidates`, {
        params,
        timeout: 10000,
      });

      return response.data.candidates || [];
    } catch (error: any) {
      console.error('Error fetching candidates from VoteSmart:', error.message);
      return [];
    }
  }

  /**
   * Get detailed candidate biography
   */
  async getCandidateBio(candidateId: string): Promise<VoteSmartCandidate | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/candidates/${candidateId}/bio`, {
        params: { key: this.apiKey },
        timeout: 10000,
      });

      return response.data.bio || null;
    } catch (error: any) {
      console.error(`Error fetching bio for candidate ${candidateId}:`, error.message);
      return null;
    }
  }

  /**
   * Get candidate education history
   */
  async getCandidateEducation(candidateId: string): Promise<Education | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/candidates/${candidateId}/bio`, {
        params: { key: this.apiKey },
        timeout: 10000,
      });

      return response.data.bio?.education || null;
    } catch (error: any) {
      console.error(`Error fetching education for candidate ${candidateId}:`, error.message);
      return null;
    }
  }

  /**
   * Get candidate professional experience
   */
  async getCandidateExperience(candidateId: string): Promise<Experience | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/candidates/${candidateId}/bio`, {
        params: { key: this.apiKey },
        timeout: 10000,
      });

      // Experience might be in different fields depending on API version
      const bio = response.data.bio;
      if (bio?.profession) {
        return {
          experience: [{
            title: 'Professional Background',
            organization: bio.profession,
            fullText: bio.profession,
          }]
        };
      }

      return null;
    } catch (error: any) {
      console.error(`Error fetching experience for candidate ${candidateId}:`, error.message);
      return null;
    }
  }

  /**
   * Get candidate ratings from various organizations
   */
  async getCandidateRatings(candidateId: string): Promise<CandidateRating[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/candidates/${candidateId}/ratings`, {
        params: { key: this.apiKey },
        timeout: 10000,
      });

      return response.data.candidateRating || [];
    } catch (error: any) {
      console.error(`Error fetching ratings for candidate ${candidateId}:`, error.message);
      return [];
    }
  }

  /**
   * Get candidate positions on issues
   */
  async getCandidatePositions(candidateId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/npat/${candidateId}`, {
        params: { key: this.apiKey },
        timeout: 10000,
      });

      return response.data.npat || [];
    } catch (error: any) {
      console.error(`Error fetching positions for candidate ${candidateId}:`, error.message);
      return [];
    }
  }

  /**
   * Transform VoteSmart candidate data to our database format
   */
  transformCandidateToProfile(voteSmartCandidate: VoteSmartCandidate, education?: Education, experience?: Experience) {
    const fullName = [
      voteSmartCandidate.firstName,
      voteSmartCandidate.middleName,
      voteSmartCandidate.lastName,
      voteSmartCandidate.suffix
    ].filter(Boolean).join(' ');

    return {
      fullName,
      preferredName: voteSmartCandidate.preferredName || voteSmartCandidate.firstName,
      birthDate: voteSmartCandidate.birthDate,
      birthPlace: voteSmartCandidate.birthPlace,
      gender: voteSmartCandidate.gender,
      politicalExperience: voteSmartCandidate.political || '',
      currentOccupation: voteSmartCandidate.profession || '',
      education: education?.institutions?.map(inst => ({
        institution: inst.school || '',
        degree: inst.degree || '',
        field: inst.field || '',
        year: inst.span || '',
        details: inst.fullText || '',
      })) || [],
      employmentHistory: experience?.experience?.map(exp => ({
        title: exp.title || '',
        organization: exp.organization || '',
        duration: exp.span || '',
        description: exp.fullText || '',
      })) || [],
      religion: voteSmartCandidate.religion,
      family: voteSmartCandidate.family,
      specialMessage: voteSmartCandidate.specialMsg,
      photoUrl: voteSmartCandidate.photo,
      dataSource: 'VoteSmart API',
      verificationStatus: 'verified',
      dataCompleteness: {
        hasBasicInfo: true,
        hasEducation: !!education?.institutions?.length,
        hasExperience: !!experience?.experience?.length,
        hasPhoto: !!voteSmartCandidate.photo,
        hasPoliticalExperience: !!voteSmartCandidate.political,
      },
    };
  }

  /**
   * Fetch complete candidate profile from VoteSmart
   */
  async fetchCompleteProfile(candidateId: string) {
    try {
      console.log(`📥 Fetching complete profile for candidate ${candidateId} from VoteSmart...`);

      const [bio, education, experience, ratings, positions] = await Promise.all([
        this.getCandidateBio(candidateId),
        this.getCandidateEducation(candidateId),
        this.getCandidateExperience(candidateId),
        this.getCandidateRatings(candidateId),
        this.getCandidatePositions(candidateId),
      ]);

      if (!bio) {
        console.log(`❌ No bio found for candidate ${candidateId}`);
        return null;
      }

      const profile = this.transformCandidateToProfile(bio, education || undefined, experience || undefined);

      return {
        profile,
        ratings,
        positions,
        rawData: { bio, education, experience },
      };
    } catch (error: any) {
      console.error(`Error fetching complete profile for candidate ${candidateId}:`, error.message);
      return null;
    }
  }
}

// Export singleton instance
export const voteSmartService = new VoteSmartService();

