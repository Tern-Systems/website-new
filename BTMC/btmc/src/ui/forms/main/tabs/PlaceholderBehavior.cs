using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace btmc.src.ui.forms.main.tabs
{
    public static class PlaceholderBehavior
    {
        public static readonly DependencyProperty PlaceholderProperty =
            DependencyProperty.RegisterAttached(
                "Placeholder",
                typeof(string),
                typeof(PlaceholderBehavior),
                new PropertyMetadata(string.Empty, OnPlaceholderChanged));

        public static string GetPlaceholder(TextBox textBox)
        {
            return (string)textBox.GetValue(PlaceholderProperty);
        }

        public static void SetPlaceholder(TextBox textBox, string value)
        {
            textBox.SetValue(PlaceholderProperty, value);
        }

        private static void OnPlaceholderChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is not TextBox tb) return;

            tb.Loaded -= TextBox_Loaded;
            tb.GotFocus -= TextBox_GotFocus;
            tb.LostFocus -= TextBox_LostFocus;

            tb.Loaded += TextBox_Loaded;
            tb.GotFocus += TextBox_GotFocus;
            tb.LostFocus += TextBox_LostFocus;
        }

        private static void TextBox_Loaded(object sender, RoutedEventArgs e)
        {
            var tb = sender as TextBox;
            ApplyPlaceholder(tb);
        }

        private static void TextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            var tb = sender as TextBox;
            var placeholder = GetPlaceholder(tb);

            if (tb.Text == placeholder)
            {
                tb.Text = "";
                tb.Foreground = Brushes.White;
            }
        }

        private static void TextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            var tb = sender as TextBox;
            ApplyPlaceholder(tb);
        }

        private static void ApplyPlaceholder(TextBox tb)
        {
            var placeholder = GetPlaceholder(tb);

            if (string.IsNullOrWhiteSpace(tb.Text))
            {
                tb.Text = placeholder;
                tb.Foreground = Brushes.Gray;
            }
        }
    }
}
