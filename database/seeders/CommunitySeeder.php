<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommunitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Creating sample users first...');
            $users = User::factory(5)->create();
        }

        $posts = [
            [
                'title' => 'My Experience with Apple Scab Treatment',
                'content' => "I recently discovered apple scab on my apple trees and wanted to share my treatment experience. I started by removing all fallen leaves and applying a copper-based fungicide. After 3 weeks, I noticed significant improvement. The key was early detection and consistent treatment.\n\nI also found that improving air circulation by pruning helped a lot. Has anyone else had success with similar methods?",
                'category' => 'experience',
                'tags' => ['apple', 'scab', 'treatment', 'fungicide'],
                'user_id' => $users->random()->id,
                'views' => rand(50, 200),
                'likes' => rand(5, 25),
                'is_featured' => true,
            ],
            [
                'title' => 'Question: Best Time to Plant Tomatoes?',
                'content' => "I'm planning to start a tomato garden this year and I'm wondering about the best timing. I live in zone 6 and want to avoid common diseases like early blight.\n\nWhen should I start seeds indoors? And what's the best time to transplant outside? Also, any tips for preventing common tomato diseases?",
                'category' => 'question',
                'tags' => ['tomato', 'planting', 'timing', 'disease-prevention'],
                'user_id' => $users->random()->id,
                'views' => rand(30, 150),
                'likes' => rand(3, 15),
            ],
            [
                'title' => 'Tip: Natural Remedies for Plant Diseases',
                'content' => "I've been experimenting with natural remedies for plant diseases and wanted to share some effective methods:\n\n1. **Baking Soda Spray**: Mix 1 tablespoon baking soda, 1 tablespoon vegetable oil, and 1 teaspoon liquid soap in 1 gallon of water. Great for powdery mildew.\n\n2. **Neem Oil**: Excellent for various fungal diseases and pests.\n\n3. **Garlic Spray**: Blend garlic cloves with water and strain. Effective against many fungal diseases.\n\n4. **Compost Tea**: Boosts plant immunity naturally.\n\nThese methods work best when applied early and consistently. Always test on a small area first!",
                'category' => 'tip',
                'tags' => ['natural-remedies', 'organic', 'disease-prevention', 'home-remedies'],
                'user_id' => $users->random()->id,
                'views' => rand(100, 300),
                'likes' => rand(10, 40),
                'is_featured' => true,
            ],
            [
                'title' => 'Success Story: Saving My Grape Vines',
                'content' => "Last year, my grape vines were severely affected by black rot. I thought I would lose the entire crop. Here's what I did to save them:\n\n1. Immediately removed all infected parts\n2. Applied fungicide every 7-10 days\n3. Improved trellising for better air circulation\n4. Added organic mulch to prevent soil splash\n\nThis year, my vines are healthy and producing well! The key was being aggressive with treatment and not giving up. Anyone else have grape disease success stories?",
                'category' => 'experience',
                'tags' => ['grape', 'black-rot', 'success-story', 'treatment'],
                'user_id' => $users->random()->id,
                'views' => rand(40, 180),
                'likes' => rand(8, 30),
            ],
            [
                'title' => 'How to Identify Common Plant Diseases',
                'content' => "Early identification is crucial for effective disease management. Here's a quick guide:\n\n**Fungal Diseases**:\n- Powdery mildew: White powdery spots on leaves\n- Rust: Orange/brown pustules on undersides of leaves\n- Blight: Brown/black spots that spread rapidly\n\n**Bacterial Diseases**:\n- Bacterial spot: Small, dark lesions with yellow halos\n- Bacterial wilt: Wilting despite adequate water\n\n**Viral Diseases**:\n- Mosaic patterns on leaves\n- Stunted growth\n- Distorted leaves\n\nAlways take photos and compare with reliable sources. When in doubt, consult with local extension services.",
                'category' => 'tip',
                'tags' => ['identification', 'disease-guide', 'early-detection', 'diagnosis'],
                'user_id' => $users->random()->id,
                'views' => rand(80, 250),
                'likes' => rand(12, 35),
                'is_pinned' => true,
            ],
            [
                'title' => 'Question: Corn Disease Prevention',
                'content' => "I'm growing corn for the first time this year and I'm concerned about common corn diseases like gray leaf spot and common rust.\n\nWhat are the best prevention strategies? Should I use resistant varieties? And what fungicides are most effective for corn?\n\nI'm in the Midwest if that helps with recommendations.",
                'category' => 'question',
                'tags' => ['corn', 'disease-prevention', 'gray-leaf-spot', 'rust'],
                'user_id' => $users->random()->id,
                'views' => rand(25, 120),
                'likes' => rand(2, 12),
            ],
            [
                'title' => 'My Organic Garden Journey',
                'content' => "I've been transitioning to organic gardening methods for the past 3 years. Here are the biggest lessons I've learned:\n\n1. **Soil Health is Everything**: Healthy soil = healthy plants = fewer diseases\n2. **Crop Rotation is Essential**: Prevents disease buildup in soil\n3. **Companion Planting Works**: Some plants naturally repel pests and diseases\n4. **Timing Matters**: Planting at the right time reduces disease pressure\n5. **Observation is Key**: Regular monitoring catches problems early\n\nIt's been challenging but rewarding. The plants are healthier and the produce tastes better!",
                'category' => 'experience',
                'tags' => ['organic-gardening', 'soil-health', 'crop-rotation', 'companion-planting'],
                'user_id' => $users->random()->id,
                'views' => rand(60, 200),
                'likes' => rand(15, 45),
            ],
            [
                'title' => 'DIY Plant Disease Monitoring System',
                'content' => "I built a simple monitoring system for my garden that helps me track plant health:\n\n**Materials Needed**:\n- Smartphone or camera\n- Weather station (optional)\n- Garden journal\n\n**Process**:\n1. Take weekly photos of each plant\n2. Record weather conditions\n3. Note any changes in appearance\n4. Use apps to identify issues early\n\nThis system helped me catch powdery mildew on my roses before it spread. Prevention is always better than cure!",
                'category' => 'tip',
                'tags' => ['monitoring', 'prevention', 'technology', 'early-detection'],
                'user_id' => $users->random()->id,
                'views' => rand(35, 140),
                'likes' => rand(6, 20),
            ],
        ];

        foreach ($posts as $postData) {
            $post = Post::create($postData);
            $post->published_at = now()->subDays(rand(1, 30));
            $post->save();

            // Create comments for each post
            $commentCount = rand(2, 8);
            for ($i = 0; $i < $commentCount; $i++) {
                $comment = Comment::create([
                    'user_id' => $users->random()->id,
                    'post_id' => $post->id,
                    'content' => $this->getRandomComment(),
                    'likes' => rand(0, 10),
                ]);

                // Add some replies
                if (rand(0, 1)) {
                    Comment::create([
                        'user_id' => $users->random()->id,
                        'post_id' => $post->id,
                        'parent_id' => $comment->id,
                        'content' => $this->getRandomReply(),
                        'likes' => rand(0, 5),
                    ]);
                }
            }
        }

        $this->command->info('Community posts and comments seeded successfully!');
    }

    private function getRandomComment(): string
    {
        $comments = [
            "Great information! I'll definitely try this method.",
            "Thanks for sharing your experience. This is very helpful.",
            "I've had similar issues. Your approach sounds promising.",
            "Interesting perspective. I might give this a try.",
            "This is exactly what I needed to know. Thank you!",
            "I've been struggling with this too. Your tips are valuable.",
            "Excellent advice! I'll implement this in my garden.",
            "This worked well for me too. Great post!",
            "I'm going to try this approach. Thanks for the detailed explanation.",
            "Very informative! I learned a lot from this.",
        ];

        return $comments[array_rand($comments)];
    }

    private function getRandomReply(): string
    {
        $replies = [
            "I agree with this approach.",
            "That's a good point!",
            "Thanks for the clarification.",
            "I'll keep that in mind.",
            "Good to know!",
            "That makes sense.",
            "I appreciate the insight.",
            "Thanks for sharing!",
        ];

        return $replies[array_rand($replies)];
    }
}