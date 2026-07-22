import json
import glob
import os

target_files = [
    "/home/julianemariasilvaesantos/Documentos/komunic alfa/komunic_alfa_expo/app/games/festa_alfabeto.tsx",
    "/home/julianemariasilvaesantos/Documentos/komunic alfa/komunic_alfa_expo/app/games/festa_numeros.tsx",
    "/home/julianemariasilvaesantos/Documentos/komunic alfa/jogo_web/www/fon-fon.html",
    "/home/julianemariasilvaesantos/Documentos/komunic alfa/jogo_web/www/jogo-baloes.html",
    "/home/julianemariasilvaesantos/Documentos/komunic alfa/jogo_web/www/tangram.html",
    "/home/julianemariasilvaesantos/Documentos/komunic alfa/jogo_web/www/index.html"
]

files_found = {f: None for f in target_files}
files_timestamps = {f: "" for f in target_files}

# We need the FIRST version of fon-fon.html, jogo-baloes.html, tangram.html, index.html that appears in this current conversation?
# Or the LAST version across all conversations EXCEPT the ones I modified in the current conversation?
# The user said "todos os jogos que fiz hoje quero todos funcionandos da mesma forma que criei"
# This means for the web games (created in THIS conversation), they want the ORIGINAL version (the first write_to_file call in this conversation, or whatever was before I changed them).
# For festa_alfabeto and festa_numeros, they were created in ANOTHER conversation today, so we just want their latest version from any transcript.

# Let's extract all write_to_file calls for these files from all transcripts.
transcripts = glob.glob("/home/julianemariasilvaesantos/.gemini/antigravity/brain/*/.system_generated/logs/transcript_full.jsonl")

# Sort transcripts by modified time to process older ones first, then newer ones
transcripts.sort(key=os.path.getmtime)

for transcript in transcripts:
    try:
        with open(transcript, 'r') as f:
            for line in f:
                try:
                    obj = json.loads(line)
                    if obj.get('type') == 'PLANNER_RESPONSE' and 'tool_calls' in obj:
                        for tc in obj['tool_calls']:
                            if tc.get('name') == 'write_to_file':
                                args = tc.get('args', {})
                                tf = args.get('TargetFile')
                                if tf in files_found:
                                    # For festa_*, we want the absolute latest.
                                    # For web games, wait, they were created in THIS conversation.
                                    # If they were created in this conversation, we want the FIRST one from this conversation.
                                    # Let's just collect all versions.
                                    if 'versions' not in files_found[tf] if files_found[tf] else True:
                                        if not files_found[tf]: files_found[tf] = []
                                    files_found[tf].append({
                                        'content': args.get('CodeContent'),
                                        'time': obj.get('created_at'),
                                        'transcript': transcript
                                    })
                except Exception:
                    pass
    except Exception:
        pass

# Now restore
for tf, versions in files_found.items():
    if not versions:
        print(f"Could not find any history for {tf}")
        continue
    
    # Sort versions by time
    versions.sort(key=lambda x: x['time'])
    
    content_to_restore = None
    if "festa_" in tf:
        # Latest version overall
        content_to_restore = versions[-1]['content']
    else:
        # For the HTML games, the user created them today. 
        # The FIRST version from this current conversation's transcript is the one they provided/approved before I "improved" them.
        current_convo = "/home/julianemariasilvaesantos/.gemini/antigravity/brain/ac614b72-def1-413c-abc8-85dc2cb22bd6"
        current_versions = [v for v in versions if current_convo in v['transcript']]
        if current_versions:
            # We want the FIRST version in this conversation (the one I saved originally)
            content_to_restore = current_versions[0]['content']
        else:
            # Fallback
            content_to_restore = versions[-1]['content']

    if content_to_restore:
        os.makedirs(os.path.dirname(tf), exist_ok=True)
        with open(tf, 'w') as f:
            f.write(content_to_restore)
        print(f"Restored {tf}")

print("Done restoring files.")
