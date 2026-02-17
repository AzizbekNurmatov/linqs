import { supabase } from './supabase';
import toast from 'react-hot-toast';

const STORAGE_BUCKET = 'board-uploads';

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file to upload
 * @returns {Promise<string|null>} Public URL or null on error
 */
async function uploadImage(file) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to upload images');
      return null;
    }

    // Generate unique file path: public/{timestamp}_{filename}
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `public/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Image upload error:', uploadError);
      toast.error('Failed to upload image');
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
}

/**
 * Create a Yap post
 * @param {string} content - Yap content (max 280 chars)
 * @param {boolean} isAnonymous - Whether post is anonymous
 * @returns {Promise<object|null>} Created yap or null on error
 */
export async function createYap(content, isAnonymous = false) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to post');
      return null;
    }

    const { data, error } = await supabase
      .from('yaps')
      .insert({
        user_id: user.id,
        content: content.trim(),
        is_anonymous: isAnonymous
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating yap:', error);
      toast.error('Failed to post yap');
      return null;
    }

    toast.success('Yap posted!');
    return data;
  } catch (error) {
    console.error('Error creating yap:', error);
    toast.error('Failed to post yap');
    return null;
  }
}

/**
 * Create a Flash post
 * @param {string} activity - Activity status (e.g., 'Study', 'Eat')
 * @param {string} location - Location
 * @param {string} timeFrame - 'now', '1h', or 'tonight'
 * @returns {Promise<object|null>} Created flash or null on error
 */
export async function createFlash(activity, location, timeFrame) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to post');
      return null;
    }

    // Convert activity to lowercase for DB enum
    const status = activity.toLowerCase();

    // Calculate expires_at based on timeFrame
    let expiresAt = null;
    const now = new Date();
    if (timeFrame === 'now') {
      expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    } else if (timeFrame === '1h') {
      expiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hour from now
    } else if (timeFrame === 'tonight') {
      const tonight = new Date(now);
      tonight.setHours(23, 59, 59, 999); // End of today
      expiresAt = tonight;
    }

    const { data, error } = await supabase
      .from('flashes')
      .insert({
        user_id: user.id,
        status,
        location: location.trim() || null,
        expires_at: expiresAt
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating flash:', error);
      toast.error('Failed to post flash');
      return null;
    }

    toast.success('Flash broadcasted!');
    return data;
  } catch (error) {
    console.error('Error creating flash:', error);
    toast.error('Failed to post flash');
    return null;
  }
}

/**
 * Create a Bite post
 * @param {string} biteType - 'free' or 'deal'
 * @param {string} title - What is it
 * @param {string} location - Where at
 * @param {string|null} endTime - ISO datetime string for deals, null for free drops
 * @param {File|null} imageFile - Optional image file
 * @returns {Promise<object|null>} Created bite or null on error
 */
export async function createBite(biteType, title, location, endTime = null, imageFile = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to post');
      return null;
    }

    // Map frontend biteType to DB enum
    const dbBiteType = biteType === 'free' ? 'free_drop' : 'deal_promo';

    // Upload image if provided
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        // If upload fails, don't proceed with post creation
        toast.error('Failed to upload image. Please try again.');
        return null;
      }
    }

    const { data, error } = await supabase
      .from('bites')
      .insert({
        user_id: user.id,
        bite_type: dbBiteType,
        title: title.trim(),
        location: location.trim(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
        image_url: imageUrl
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating bite:', error);
      toast.error('Failed to post bite');
      return null;
    }

    toast.success('Bite posted!');
    return data;
  } catch (error) {
    console.error('Error creating bite:', error);
    toast.error('Failed to post bite');
    return null;
  }
}

/**
 * Create a Barter post
 * @param {string} tradeType - 'goods' or 'favors'
 * @param {string} itemHave - What you have
 * @param {string} itemWant - What you want
 * @param {File|null} imageFile - Optional image file (only for goods)
 * @returns {Promise<object|null>} Created barter or null on error
 */
export async function createBarter(tradeType, itemHave, itemWant, imageFile = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to post');
      return null;
    }

    // Upload image if provided (only for goods)
    let imageUrl = null;
    if (imageFile && tradeType === 'goods') {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        // If upload fails, don't proceed with post creation
        toast.error('Failed to upload image. Please try again.');
        return null;
      }
    }

    const { data, error } = await supabase
      .from('barters')
      .insert({
        user_id: user.id,
        trade_type: tradeType,
        item_have: itemHave.trim(),
        item_want: itemWant.trim(),
        image_url: imageUrl
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating barter:', error);
      toast.error('Failed to post trade');
      return null;
    }

    toast.success('Trade posted!');
    return data;
  } catch (error) {
    console.error('Error creating barter:', error);
    toast.error('Failed to post trade');
    return null;
  }
}

/**
 * Fetch all board posts (yaps, flashes, bites, barters)
 * @returns {Promise<Array>} Array of normalized posts
 */
export async function fetchAllPosts() {
  try {
    // Fetch all posts in parallel
    // For yaps, join with profiles to get username and avatar_url
    const [yapsResult, flashesResult, bitesResult, bartersResult] = await Promise.all([
      supabase
        .from('yaps')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false }),
      supabase.from('flashes').select('*').order('created_at', { ascending: false }),
      supabase.from('bites').select('*').order('created_at', { ascending: false }).eq('is_active', true),
      supabase.from('barters').select('*').order('created_at', { ascending: false }).eq('is_completed', false)
    ]);

    const posts = [];

    // Transform yaps
    if (yapsResult.data) {
      yapsResult.data.forEach(yap => {
        const profile = yap.profiles || {};
        posts.push({
          id: yap.id,
          type: 'yap',
          content: yap.content,
          isAnonymous: yap.is_anonymous,
          userId: yap.user_id,
          username: profile.username || null,
          avatarUrl: profile.avatar_url || null,
          createdAt: yap.created_at
        });
      });
    }

    // Transform flashes
    if (flashesResult.data) {
      flashesResult.data.forEach(flash => {
        // Calculate timeFrame from expires_at
        let timeFrame = 'now';
        if (flash.expires_at) {
          const expiresAt = new Date(flash.expires_at);
          const now = new Date();
          const diffHours = (expiresAt - now) / (1000 * 60 * 60);
          
          if (diffHours <= 1) {
            timeFrame = 'now';
          } else if (diffHours <= 2) {
            timeFrame = '1h';
          } else {
            timeFrame = 'tonight';
          }
        }

        // Capitalize status for display
        const activity = flash.status.charAt(0).toUpperCase() + flash.status.slice(1);

        posts.push({
          id: flash.id,
          type: 'flash',
          activity,
          location: flash.location,
          timeFrame,
          createdAt: flash.created_at
        });
      });
    }

    // Transform bites
    if (bitesResult.data) {
      bitesResult.data.forEach(bite => {
        // Map DB bite_type to frontend biteKind
        const biteKind = bite.bite_type === 'free_drop' ? 'free' : 'deal';

        posts.push({
          id: bite.id,
          type: 'bites',
          biteKind,
          whatInput: bite.title,
          whereInput: bite.location,
          endsAt: bite.end_time,
          imageUrl: bite.image_url,
          createdAt: bite.created_at
        });
      });
    }

    // Transform barters
    if (bartersResult.data) {
      bartersResult.data.forEach(barter => {
        posts.push({
          id: barter.id,
          type: 'barter',
          mode: barter.trade_type,
          haveInput: barter.item_have,
          wantInput: barter.item_want,
          imageUrl: barter.image_url,
          createdAt: barter.created_at
        });
      });
    }

    // Sort by created_at descending
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
}
