<?php

namespace Database\Seeders;

use App\Models\AIChat;
use App\Models\AIMessage;
use App\Models\User;
use Illuminate\Database\Seeder;

class AIChatSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Creating sample users first...');
            $users = User::factory(3)->create();
        }

        $chatTemplates = [
            [
                'title' => 'Tomato Disease Diagnosis',
                'messages' => [
                    ['role' => 'user', 'content' => 'I noticed some brown spots on my tomato leaves. What could this be?'],
                    ['role' => 'assistant', 'content' => 'Brown spots on tomato leaves could indicate several diseases. The most common are early blight, late blight, or septoria leaf spot. Could you describe the spots in more detail? Are they circular, irregular, or have a specific pattern? Also, are they on the lower leaves first?'],
                    ['role' => 'user', 'content' => 'They are circular and started on the lower leaves. Some have a target-like appearance.'],
                    ['role' => 'assistant', 'content' => 'That sounds like early blight (Alternaria solani), which is very common in tomatoes. The target-like appearance with concentric rings is a classic symptom. Here\'s what you should do:\n\n1. Remove infected leaves immediately\n2. Improve air circulation by pruning\n3. Apply copper-based fungicide\n4. Mulch around plants to prevent soil splash\n5. Water at the base, not overhead\n\nWould you like me to provide more specific treatment details?'],
                    ['role' => 'user', 'content' => 'Yes, please. What fungicide would you recommend?'],
                    ['role' => 'assistant', 'content' => 'For early blight, I recommend copper-based fungicides like:\n\n- Copper sulfate (Bordeaux mixture)\n- Copper hydroxide\n- Copper octanoate\n\nApply every 7-10 days, especially after rain. Start treatment as soon as you see symptoms and continue through the growing season. Always follow label instructions and wear protective gear when applying.\n\nOrganic alternatives include neem oil or baking soda solutions, though they may be less effective than copper fungicides.'],
                ]
            ],
            [
                'title' => 'Apple Tree Care',
                'messages' => [
                    ['role' => 'user', 'content' => 'I want to plant apple trees. What should I know about preventing diseases?'],
                    ['role' => 'assistant', 'content' => 'Great question! Apple trees can be affected by several diseases. Here are the key prevention strategies:\n\n1. **Choose Resistant Varieties**: Look for varieties resistant to apple scab, fire blight, and cedar apple rust\n2. **Site Selection**: Plant in full sun with good air circulation\n3. **Proper Spacing**: Allow adequate space between trees\n4. **Pruning**: Regular pruning improves air flow and reduces disease pressure\n5. **Sanitation**: Remove fallen leaves and fruit\n6. **Preventive Sprays**: Apply dormant sprays in late winter\n\nWhat specific diseases are common in your area?'],
                    ['role' => 'user', 'content' => 'I\'m in the Northeast US. What varieties would you recommend?'],
                    ['role' => 'assistant', 'content' => 'For the Northeast US, these varieties have good disease resistance:\n\n**Apple Scab Resistant:**\n- Liberty\n- Enterprise\n- GoldRush\n- Williams Pride\n- Pristine\n\n**Fire Blight Resistant:**\n- Liberty\n- Enterprise\n- GoldRush\n\n**General Recommendations:**\n- Liberty is excellent for disease resistance\n- Enterprise has good storage qualities\n- GoldRush is great for fresh eating\n\nConsider planting at least two varieties for cross-pollination. Also, check with your local extension office for region-specific recommendations.'],
                ]
            ],
            [
                'title' => 'Organic Pest Control',
                'messages' => [
                    ['role' => 'user', 'content' => 'What are the best organic methods for controlling garden pests?'],
                    ['role' => 'assistant', 'content' => 'Organic pest control focuses on prevention and natural solutions. Here are the most effective methods:\n\n**Prevention:**\n- Healthy soil and plants are naturally more resistant\n- Crop rotation to break pest cycles\n- Companion planting (marigolds, basil, etc.)\n- Proper spacing for good air circulation\n\n**Physical Controls:**\n- Hand picking larger pests\n- Row covers for protection\n- Sticky traps for flying insects\n- Beneficial insects (ladybugs, lacewings)\n\n**Natural Sprays:**\n- Neem oil (repels many pests)\n- Insecticidal soap (for soft-bodied insects)\n- Diatomaceous earth (for crawling insects)\n- Garlic/pepper sprays\n\nWhat specific pests are you dealing with?'],
                    ['role' => 'user', 'content' => 'I have aphids on my roses and tomato hornworms.'],
                    ['role' => 'assistant', 'content' => 'Perfect! Here\'s how to handle both:\n\n**For Aphids on Roses:**\n1. Blast them off with a strong water spray\n2. Apply insecticidal soap every 3-5 days\n3. Introduce ladybugs (natural predators)\n4. Plant companion plants like garlic or chives\n5. Check for ants (they farm aphids) and control them\n\n**For Tomato Hornworms:**\n1. Hand pick them (they\'re large and easy to spot)\n2. Look for white cocoons on their backs (parasitic wasps)\n3. Apply Bacillus thuringiensis (Bt) if infestation is heavy\n4. Plant marigolds as a deterrent\n5. Rotate tomatoes to different areas each year\n\n**Pro Tip:** Check your plants daily for hornworms - they can defoliate a plant quickly!'],
                ]
            ],
            [
                'title' => 'Soil Health Questions',
                'messages' => [
                    ['role' => 'user', 'content' => 'How can I improve my garden soil health?'],
                    ['role' => 'assistant', 'content' => 'Soil health is the foundation of successful gardening! Here are the key ways to improve it:\n\n**Organic Matter:**\n- Add compost (homemade or purchased)\n- Use aged manure\n- Apply leaf mulch\n- Plant cover crops\n\n**Soil Testing:**\n- Test pH and nutrient levels\n- Adjust pH as needed (most plants prefer 6.0-7.0)\n- Add specific nutrients based on test results\n\n**Physical Structure:**\n- Avoid compacting soil when wet\n- Use raised beds if drainage is poor\n- Add sand to heavy clay soils\n- Add organic matter to sandy soils\n\n**Biological Activity:**\n- Avoid over-tilling\n- Use crop rotation\n- Add mycorrhizal fungi\n- Apply compost tea\n\nWould you like me to explain any of these methods in more detail?'],
                    ['role' => 'user', 'content' => 'What\'s the best way to make compost?'],
                    ['role' => 'assistant', 'content' => 'Great question! Here\'s how to make effective compost:\n\n**Materials to Include:**\n- Green materials (nitrogen): grass clippings, kitchen scraps, coffee grounds\n- Brown materials (carbon): leaves, straw, wood chips, paper\n- Ratio: 2-3 parts brown to 1 part green\n\n**What NOT to Include:**\n- Meat, dairy, or oily foods\n- Diseased plants\n- Weeds with seeds\n- Pet waste\n\n**Methods:**\n1. **Simple Pile**: Layer materials in a corner of your yard\n2. **Bin System**: Use a compost bin or tumbler\n3. **Trench Composting**: Bury kitchen scraps directly in garden\n\n**Maintenance:**\n- Turn pile every 1-2 weeks\n- Keep moist but not wet\n- Monitor temperature (should feel warm)\n- Compost is ready when dark and crumbly (3-12 months)\n\n**Quick Start:**\nMix equal parts grass clippings and fallen leaves, keep moist, and turn regularly!'],
                ]
            ],
        ];

        foreach ($chatTemplates as $template) {
            $user = $users->random();
            
            $chat = AIChat::create([
                'user_id' => $user->id,
                'title' => $template['title'],
                'model' => 'gpt-3.5-turbo',
                'is_active' => true,
                'last_activity' => now()->subDays(rand(1, 7)),
            ]);

            // Add system message
            AIMessage::create([
                'ai_chat_id' => $chat->id,
                'role' => 'system',
                'content' => 'You are a helpful AI assistant specialized in plant disease detection and gardening advice. You can help users identify plant diseases, provide treatment recommendations, and answer gardening questions.',
            ]);

            // Add conversation messages
            foreach ($template['messages'] as $messageData) {
                AIMessage::create([
                    'ai_chat_id' => $chat->id,
                    'role' => $messageData['role'],
                    'content' => $messageData['content'],
                    'created_at' => $chat->created_at->addMinutes(rand(5, 60)),
                ]);
            }
        }

        $this->command->info('AI Chat sample data seeded successfully!');
    }
}