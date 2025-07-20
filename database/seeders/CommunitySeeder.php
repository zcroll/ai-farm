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
        // Create sample users if they don't exist
        $users = User::all();
        if ($users->count() < 5) {
            $users = User::factory(5)->create();
        }

        // Sample categories
        $categories = [
            'Disease Diagnosis',
            'Plant Care',
            'Success Stories',
            'Equipment',
            'General'
        ];

        // Sample posts data
        $postsData = [
            [
                'title' => 'Tomato Plant Leaves Turning Yellow - Need Help!',
                'content' => "I've been growing tomatoes for the past few months, but recently I noticed the leaves are turning yellow from the bottom up. I water them regularly and they get plenty of sunlight. Has anyone experienced this before? What could be causing it?\n\nI've attached some photos. The plants are about 2 months old and were doing great until last week.",
                'category' => 'Disease Diagnosis',
                'tags' => ['tomato', 'yellow-leaves', 'help-needed'],
                'is_featured' => true,
            ],
            [
                'title' => 'Successful Harvest: My Organic Pepper Garden',
                'content' => "After months of careful nurturing, I'm thrilled to share my successful pepper harvest! This season I grew bell peppers, jalapeños, and habaneros using completely organic methods.\n\nKey things that helped:\n- Companion planting with basil\n- Regular soil testing\n- Natural pest control methods\n- Consistent watering schedule\n\nThe yield was amazing - 50% more than last year!",
                'category' => 'Success Stories',
                'tags' => ['peppers', 'organic', 'harvest', 'success'],
                'is_featured' => true,
            ],
            [
                'title' => 'Best Soil pH Testing Kit for Small Farms?',
                'content' => "I'm looking to invest in a good soil pH testing kit for my small farm. Currently using basic strips but want something more accurate for better crop planning.\n\nWhat do you all recommend? Budget is around $200-300. Need something portable and easy to use in the field.",
                'category' => 'Equipment',
                'tags' => ['soil-testing', 'equipment', 'recommendations'],
                'is_pinned' => true,
            ],
            [
                'title' => 'White Spots on Cucumber Leaves',
                'content' => "Found white powdery spots on my cucumber leaves this morning. They seem to be spreading quickly. Is this powdery mildew? How do I treat it naturally without chemicals?",
                'category' => 'Disease Diagnosis',
                'tags' => ['cucumber', 'white-spots', 'powdery-mildew'],
            ],
            [
                'title' => 'Companion Planting Guide for Beginners',
                'content' => "Starting my first vegetable garden and heard about companion planting. Can someone share a simple guide or chart showing which plants grow well together?\n\nI'm planning to grow:\n- Tomatoes\n- Carrots\n- Lettuce\n- Beans\n- Herbs",
                'category' => 'Plant Care',
                'tags' => ['companion-planting', 'beginner', 'guide'],
            ],
            [
                'title' => 'Aphid Infestation - Natural Solutions That Work',
                'content' => "Dealing with a serious aphid problem on my rose bushes. Before resorting to chemicals, wanted to try natural methods first. What has worked for you?\n\nI've heard about:\n- Ladybugs\n- Neem oil\n- Soap spray\n- Companion plants\n\nAny success stories?",
                'category' => 'Plant Care',
                'tags' => ['aphids', 'natural-remedies', 'roses'],
            ],
            [
                'title' => 'Setting Up Drip Irrigation System',
                'content' => "Planning to install a drip irrigation system for my vegetable garden. Any recommendations for DIY-friendly systems? Garden is about 500 sq ft.",
                'category' => 'Equipment',
                'tags' => ['irrigation', 'DIY', 'water-management'],
            ],
            [
                'title' => 'From Seed to Harvest: My Carrot Journey',
                'content' => "Documenting my carrot growing experience from seed to harvest. Week 12 update: Finally harvested! Some lessons learned along the way that might help other beginners.",
                'category' => 'Success Stories',
                'tags' => ['carrots', 'journey', 'beginner-tips'],
            ]
        ];

        // Create posts
        foreach ($postsData as $index => $postData) {
            $post = Post::create([
                'user_id' => $users->random()->id,
                'title' => $postData['title'],
                'content' => $postData['content'],
                'category' => $postData['category'],
                'tags' => $postData['tags'],
                'views' => rand(10, 500),
                'likes' => rand(0, 50),
                'is_featured' => $postData['is_featured'] ?? false,
                'is_pinned' => $postData['is_pinned'] ?? false,
                'published_at' => now()->subDays(rand(1, 30)),
            ]);

            // Add some likes
            $likers = $users->random(rand(1, 5));
            foreach ($likers as $liker) {
                $post->likes()->attach($liker->id);
            }

            // Add comments
            $commentCount = rand(1, 8);
            for ($i = 0; $i < $commentCount; $i++) {
                $comment = Comment::create([
                    'user_id' => $users->random()->id,
                    'post_id' => $post->id,
                    'content' => $this->getRandomComment($postData['category']),
                    'is_approved' => true,
                    'created_at' => now()->subDays(rand(0, 15)),
                ]);

                // Add some likes to comments
                $commentLikers = $users->random(rand(0, 3));
                foreach ($commentLikers as $liker) {
                    $comment->likes()->attach($liker->id);
                }

                // Add replies (30% chance)
                if (rand(1, 10) <= 3) {
                    $reply = Comment::create([
                        'user_id' => $users->random()->id,
                        'post_id' => $post->id,
                        'parent_id' => $comment->id,
                        'content' => $this->getRandomReply(),
                        'is_approved' => true,
                        'created_at' => now()->subDays(rand(0, 10)),
                    ]);

                    // Add likes to replies
                    $replyLikers = $users->random(rand(0, 2));
                    foreach ($replyLikers as $liker) {
                        $reply->likes()->attach($liker->id);
                    }
                }
            }
        }
    }

    private function getRandomComment($category): string
    {
        $comments = [
            'Disease Diagnosis' => [
                "I had the same issue last season. Try checking the soil drainage - overwatering can cause similar symptoms.",
                "This looks like a nutrient deficiency to me. Have you tested your soil lately?",
                "I recommend removing the affected leaves and improving air circulation around the plants.",
                "Similar thing happened to my plants. Turns out it was early blight. Check for brown spots with rings.",
                "Make sure you're not watering the leaves directly. Water at the base of the plant instead.",
            ],
            'Plant Care' => [
                "Great question! I've found that companion planting really does make a difference.",
                "For natural pest control, I swear by neem oil spray applied in the evening.",
                "Consistency is key with watering. I use a moisture meter to check soil before watering.",
                "Mulching has been a game-changer for my garden. Helps retain moisture and suppress weeds.",
                "Don't forget about beneficial insects! They're your best allies in the garden.",
            ],
            'Success Stories' => [
                "Congratulations! Your harvest looks amazing. Thanks for sharing the tips!",
                "Inspiring story! I'm definitely going to try some of your techniques.",
                "Love seeing success stories like this. Gives me motivation for my own garden.",
                "Your organic approach is fantastic. We need more growers like you!",
                "Amazing results! How long did it take from seed to harvest?",
            ],
            'Equipment' => [
                "I've been using the XYZ brand tester for 2 years now - very reliable and accurate.",
                "For that budget, you might want to consider the ABC model. Great features for the price.",
                "Digital meters are definitely worth the investment over strips for consistent results.",
                "Check out local agricultural extension offices - they sometimes loan equipment.",
                "Make sure whatever you get is waterproof if you'll be using it in muddy conditions.",
            ],
            'General' => [
                "Thanks for sharing! Always learning something new in this community.",
                "This is exactly the kind of information I was looking for.",
                "Great post! Have you considered documenting your process with photos?",
                "I'm new to gardening and posts like this are so helpful.",
                "Keep us updated on your progress!",
            ]
        ];

        $categoryComments = $comments[$category] ?? $comments['General'];
        return $categoryComments[array_rand($categoryComments)];
    }

    private function getRandomReply(): string
    {
        $replies = [
            "Thanks for the advice! I'll definitely try that.",
            "That's a great point. I hadn't considered that angle.",
            "Really appreciate the detailed response!",
            "I tried something similar and it worked well for me too.",
            "Good to know! I'll keep that in mind for next season.",
            "Thanks for sharing your experience!",
            "That makes a lot of sense. I'll give it a shot.",
            "Appreciate the help from this community!",
        ];

        return $replies[array_rand($replies)];
    }
}