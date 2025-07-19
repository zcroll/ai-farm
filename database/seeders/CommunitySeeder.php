<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommunitySeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Creating sample users first...');
            $users = User::factory(5)->create();
        }

        $posts = [
            [
                'title' => 'My Experience with Tomato Blight - A Success Story',
                'content' => "I wanted to share my experience dealing with early blight on my tomato plants this season. Initially, I noticed small brown spots on the lower leaves, and within a week, the disease was spreading rapidly.\n\nHere's what I did to successfully manage it:\n\n1. **Immediate Action**: Removed all infected leaves and stems\n2. **Improved Air Circulation**: Pruned the plants to allow better airflow\n3. **Mulching**: Added straw mulch to prevent soil splash\n4. **Fungicide Application**: Used copper-based fungicide every 7-10 days\n5. **Watering Technique**: Changed to drip irrigation to keep leaves dry\n\nAfter 3 weeks of consistent treatment, the new growth was healthy and the disease was under control. The key was early detection and consistent treatment!\n\nHas anyone else had success with similar methods?",
                'category' => 'experience',
                'tags' => ['tomato', 'early-blight', 'treatment', 'success'],
                'user_id' => $users->random()->id,
                'views' => rand(50, 200),
                'likes' => rand(10, 50),
                'is_featured' => true,
                'published_at' => now()->subDays(rand(1, 30)),
            ],
            [
                'title' => 'Question: Best Organic Methods for Apple Scab Prevention?',
                'content' => "I'm planning to plant apple trees in my backyard this spring, and I'm concerned about apple scab since it's common in my area (Northeast US).\n\nI'm looking for organic prevention methods that I can implement from the start. I've read about:\n\n- Planting resistant varieties\n- Proper spacing and pruning\n- Removing fallen leaves\n- Neem oil applications\n\nDoes anyone have experience with organic apple scab management? What varieties would you recommend for resistance? Also, how effective are neem oil and other organic treatments?\n\nI'd prefer to avoid chemical fungicides if possible. Thanks for any advice!",
                'category' => 'question',
                'tags' => ['apple', 'apple-scab', 'organic', 'prevention'],
                'user_id' => $users->random()->id,
                'views' => rand(30, 150),
                'likes' => rand(5, 25),
                'published_at' => now()->subDays(rand(1, 20)),
            ],
            [
                'title' => 'Pro Tip: Using Baking Soda for Powdery Mildew',
                'content' => "I discovered an effective homemade remedy for powdery mildew that I wanted to share with the community!\n\n**Recipe:**\n- 1 tablespoon baking soda\n- 1 tablespoon vegetable oil\n- 1 teaspoon liquid soap\n- 1 gallon water\n\nMix thoroughly and spray on affected plants every 7-10 days. The baking soda creates an alkaline environment that inhibits fungal growth.\n\n**Important Notes:**\n- Test on a small area first\n- Apply in the morning to allow leaves to dry\n- Don't apply in direct sunlight\n- Works best as prevention or early treatment\n\nI've used this on my squash, cucumbers, and roses with great success. Much cheaper than commercial fungicides and completely safe for organic gardening!\n\nHas anyone else tried this method?",
                'category' => 'tip',
                'tags' => ['powdery-mildew', 'baking-soda', 'organic', 'homemade'],
                'user_id' => $users->random()->id,
                'views' => rand(100, 300),
                'likes' => rand(20, 80),
                'is_featured' => true,
                'published_at' => now()->subDays(rand(1, 15)),
            ],
            [
                'title' => 'Corn Rust Management - What Worked for Me',
                'content' => "This season I faced a serious outbreak of common rust on my sweet corn. The disease appeared in mid-July and spread quickly through my 1/4 acre plot.\n\n**Initial Symptoms:**\n- Small, circular, brick-red pustules on leaves\n- Pustules breaking open and releasing spores\n- Rapid spread to upper leaves and husks\n\n**My Response Strategy:**\n1. **Immediate Fungicide Application**: Applied azoxystrobin at first sign\n2. **Crop Rotation Planning**: Mapped out 3-year rotation for next season\n3. **Resistant Varieties**: Researched and ordered rust-resistant hybrids\n4. **Field Sanitation**: Removed and destroyed all infected debris\n\n**Results:**\n- Yield loss was limited to about 15% (much better than expected)\n- Quality of remaining ears was good\n- Learned valuable lessons for prevention\n\n**Key Takeaway**: Early detection and quick action are crucial. I'm now monitoring my corn weekly starting in early July.\n\nAnyone else dealing with corn rust this season?",
                'category' => 'experience',
                'tags' => ['corn', 'rust', 'management', 'fungicide'],
                'user_id' => $users->random()->id,
                'views' => rand(40, 180),
                'likes' => rand(8, 35),
                'published_at' => now()->subDays(rand(1, 25)),
            ],
            [
                'title' => 'Grape Black Rot - Complete Treatment Guide',
                'content' => "After losing most of my grape harvest to black rot last year, I've compiled a comprehensive treatment guide based on my research and this year's successful management.\n\n**Understanding the Disease:**\nBlack rot is caused by Guignardia bidwellii and affects leaves, fruit, and canes. The fungus overwinters in infected plant material.\n\n**Prevention Methods:**\n1. **Site Selection**: Choose sunny, well-drained locations\n2. **Variety Selection**: Plant resistant varieties when possible\n3. **Pruning**: Remove dead wood and improve air circulation\n4. **Sanitation**: Remove and destroy infected material\n\n**Treatment Protocol:**\n- **Dormant Spray**: Apply lime sulfur before bud break\n- **Protective Sprays**: Begin fungicide program at 3-4 inch shoot growth\n- **Timing**: Continue applications through 4 weeks after bloom\n- **Products**: Captan, mancozeb, or copper-based fungicides\n\n**Monitoring:**\n- Check for symptoms weekly during growing season\n- Look for circular lesions with black fruiting bodies\n- Monitor weather conditions (warm, wet weather favors disease)\n\nThis year I had 95% clean fruit! The key was consistent monitoring and timely applications.",
                'category' => 'tip',
                'tags' => ['grape', 'black-rot', 'treatment', 'guide'],
                'user_id' => $users->random()->id,
                'views' => rand(80, 250),
                'likes' => rand(15, 60),
                'is_featured' => true,
                'published_at' => now()->subDays(rand(1, 10)),
            ],
            [
                'title' => 'Question: Blueberry Disease Identification Help',
                'content' => "I'm having trouble identifying what's affecting my blueberry bushes. The symptoms include:\n\n- Reddish-brown spots on leaves\n- Some leaves turning yellow and falling off\n- Small, dark spots on stems\n- Reduced fruit production\n\nI'm in Zone 6, and the bushes are about 5 years old. I've been growing them in acidic soil (pH 4.8) with regular mulching.\n\nCould this be mummy berry, anthracnose, or something else? I've attached some photos but they're not very clear.\n\nWhat diagnostic steps should I take? Should I send samples to my local extension office?\n\nAny help would be greatly appreciated!",
                'category' => 'question',
                'tags' => ['blueberry', 'disease-identification', 'diagnosis'],
                'user_id' => $users->random()->id,
                'views' => rand(25, 120),
                'likes' => rand(3, 20),
                'published_at' => now()->subDays(rand(1, 18)),
            ],
            [
                'title' => 'Cherry Tree Care - Preventing Bacterial Canker',
                'content' => "I've been growing cherry trees for over 10 years and wanted to share my experience with preventing bacterial canker, which is a major threat to cherry production.\n\n**Prevention is Key:**\n1. **Site Selection**: Avoid frost pockets and windy locations\n2. **Variety Choice**: Plant varieties resistant to bacterial canker\n3. **Pruning Timing**: Prune only during dry weather in late summer\n4. **Tool Sanitation**: Disinfect tools between cuts and trees\n5. **Fertilization**: Avoid excessive nitrogen that promotes succulent growth\n\n**Early Detection:**\n- Look for sunken, dark lesions on branches\n- Check for gumming around wounds\n- Monitor for leaf spots and shot holes\n\n**Treatment Options:**\n- Remove infected branches 12 inches below visible symptoms\n- Apply copper sprays during dormancy\n- Consider trunk painting for young trees\n\n**My Success Story:**\nAfter implementing these practices, I've had zero canker issues for 3 consecutive years. The investment in prevention has paid off!\n\nWhat's your experience with cherry tree diseases?",
                'category' => 'experience',
                'tags' => ['cherry', 'bacterial-canker', 'prevention', 'pruning'],
                'user_id' => $users->random()->id,
                'views' => rand(60, 200),
                'likes' => rand(12, 45),
                'published_at' => now()->subDays(rand(1, 22)),
            ],
            [
                'title' => 'Organic Soil Amendments for Disease Prevention',
                'content' => "I've been experimenting with various organic soil amendments to boost plant health and disease resistance. Here's what I've found most effective:\n\n**Compost Tea Applications:**\n- Brew aerated compost tea weekly\n- Apply as foliar spray and soil drench\n- Increases beneficial microbes\n- Improves nutrient availability\n\n**Mycorrhizal Fungi:**\n- Inoculate soil with mycorrhizal fungi\n- Improves root health and nutrient uptake\n- Enhances disease resistance\n- Works best when applied at planting\n\n**Seaweed Extracts:**\n- Contains natural growth hormones\n- Improves stress tolerance\n- Enhances disease resistance\n- Apply monthly during growing season\n\n**Results After 2 Years:**\n- 40% reduction in fungal diseases\n- Improved plant vigor and yield\n- Better drought tolerance\n- Reduced need for fungicides\n\n**Application Schedule:**\n- Spring: Mycorrhizal inoculation\n- Growing Season: Weekly compost tea\n- Monthly: Seaweed extract foliar spray\n\nHas anyone else experimented with these methods? I'd love to compare results!",
                'category' => 'tip',
                'tags' => ['organic', 'soil-amendments', 'disease-prevention', 'compost-tea'],
                'user_id' => $users->random()->id,
                'views' => rand(70, 220),
                'likes' => rand(18, 55),
                'published_at' => now()->subDays(rand(1, 12)),
            ],
        ];

        foreach ($posts as $postData) {
            $post = Post::create($postData);
            
            // Add comments to each post
            $this->addCommentsToPost($post, $users);
        }

        $this->command->info('Community content seeded successfully!');
    }

    private function addCommentsToPost(Post $post, $users): void
    {
        $commentTemplates = [
            "Great post! I've had similar experiences with {disease}. Your approach seems very thorough.",
            "Thanks for sharing this! I'm definitely going to try {method} on my plants.",
            "I've been dealing with {disease} too. Have you tried {alternative_method}?",
            "This is really helpful information. I especially like the {specific_point} you mentioned.",
            "I'm new to gardening and this post is exactly what I needed. Thanks!",
            "Interesting approach! I've always used {different_method} but your method sounds promising.",
            "How long did it take you to see results with this treatment?",
            "Do you have any recommendations for {related_topic}?",
            "I've been struggling with this same issue. Your post gives me hope!",
            "Excellent detailed guide. I'm bookmarking this for future reference.",
        ];

        $diseases = ['tomato blight', 'apple scab', 'powdery mildew', 'corn rust', 'grape black rot'];
        $methods = ['organic treatment', 'fungicide application', 'pruning techniques', 'soil amendments'];
        $topics = ['prevention methods', 'resistant varieties', 'organic alternatives', 'timing of applications'];

        $numComments = rand(2, 8);
        
        for ($i = 0; $i < $numComments; $i++) {
            $template = $commentTemplates[array_rand($commentTemplates)];
            $disease = $diseases[array_rand($diseases)];
            $method = $methods[array_rand($methods)];
            $topic = $topics[array_rand($topics)];
            
            $content = str_replace(
                ['{disease}', '{method}', '{alternative_method}', '{specific_point}', '{different_method}', '{related_topic}'],
                [$disease, $method, $methods[array_rand($methods)], 'detailed approach', $methods[array_rand($methods)], $topic],
                $template
            );

            $comment = Comment::create([
                'user_id' => $users->random()->id,
                'post_id' => $post->id,
                'content' => $content,
                'likes' => rand(0, 10),
                'created_at' => $post->created_at->addMinutes(rand(5, 1440)), // Within 24 hours of post
            ]);

            // Add some replies to comments
            if (rand(1, 3) === 1) {
                $replyContent = "Thanks for the comment! " . [
                    "I'm glad you found it helpful.",
                    "Let me know how it works for you.",
                    "I'd love to hear about your results.",
                    "Feel free to ask if you need clarification.",
                    "I'm always learning from other gardeners too."
                ][array_rand([0, 1, 2, 3, 4])];

                Comment::create([
                    'user_id' => $post->user_id, // Post author replies
                    'post_id' => $post->id,
                    'parent_id' => $comment->id,
                    'content' => $replyContent,
                    'likes' => rand(0, 5),
                    'created_at' => $comment->created_at->addMinutes(rand(10, 120)),
                ]);
            }
        }
    }
}