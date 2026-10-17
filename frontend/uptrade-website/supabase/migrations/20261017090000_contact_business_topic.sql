-- Allow "business" (partnerships, research, B2B) as a contact topic
alter table public.contact_messages drop constraint if exists contact_messages_topic_check;
alter table public.contact_messages
    add constraint contact_messages_topic_check
    check (topic in ('general', 'business', 'bug', 'data', 'account'));
